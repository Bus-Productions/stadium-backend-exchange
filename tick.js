GAME = {};

GAME.config = require('./config/config.js').config();

// set up models
GAME.db = require('./models/models.js');

// add interval
//

var prepare = function(callback){
  var now = new Date();

  GAME.db.sequelize.query('SELECT DISTINCT symbol FROM "Bids" WHERE NOT matched AND order_placed_at <= \''+now.toUTCString()+'\' UNION SELECT DISTINCT symbol FROM "Asks" WHERE NOT matched AND order_placed_at <= \''+now.toUTCString()+"'").success(function(symbols){
    if (callback) { callback(now, symbols); }
  }).error(function(err){
    console.log(err);
  });

}

var pretick = function(now, symbols, callback){

  for (var i=0;i<symbols.length;i++){
    (function(){ //anon function necessary to close this_symbol

      var this_symbol = symbols[i].symbol;
      var chainer = new GAME.db.Sequelize.Utils.QueryChainer;

      chainer
        .add(
          GAME.db.Bid.findAll({ where: ["symbol = ? AND NOT matched AND order_placed_at <= ?", this_symbol, now.toUTCString()]}).error(function(err){
            console.log(err);
          })
          )
        .add(
          GAME.db.Ask.findAll({ where: ["symbol = ? AND NOT matched AND order_placed_at <= ?", this_symbol, now.toUTCString()]}).error(function(err){
            console.log(err);
          })
          )
        .run()
        .success(function(results){
          var bids = results[0];
          var asks = results[1];
          console.log(this_symbol);
          //console.log(bids);
          //console.log(asks);

          // get price change modifiers
          muckMarket(bids, asks, function(){
            // once everything is done, call callback with THIS symbol
            if (callback) { callback(now, this_symbol); }
          });

        })
        .error(function(err){
          console.log(err);
        });

    })();
  }
}

var muckMarket = function(bids, asks, callback){
  // add price affecting bid/ask quantities
  var bid_q_pa = 0,
      bid_q = 0,
      ask_q = 0,
      ask_q_pa = 0;
  for (var b=0;b<bids.length;b++){
    //console.log(bids[b].values);
    bid_q += bids[b].values.quantity;
    if (bids[b].values.price_affecting) { bid_q_pa += bids[b].values.quantity; }
  }
  for (var a=0;a<asks.length;a++){
    //console.log(asks[a].values);
    ask_q += asks[a].values.quantity;
    if (asks[a].values.price_affecting) { ask_q_pa += asks[a].values.quantity; }
  }
  console.log(bid_q_pa);
  console.log(ask_q_pa);
  console.log(bid_q);
  console.log(ask_q);

  GAME.db.Symbol.find({ where: { symbol: bids[0].values.symbol }}).success(function(symbol){
    var factor = ((bid_q_pa - ask_q_pa) / symbol.issued) + 1;
    console.log("factor", factor);
    var new_price = symbol.price * factor;
    console.log("new price", new_price);

    symbol.price = new_price;
    symbol.issued = symbol.issued + (bid_q - ask_q);

    var chainer = new GAME.db.Sequelize.Utils.QueryChainer;
    chainer.add(symbol.save());
    for (var b=0;b<bids.length;b++){
      bids[b].price_actual = new_price;
      chainer.add(bids[b].save());
    }
    for (var a=0;a<asks.length;a++){
      asks[a].price_actual = new_price;
      chainer.add(asks[a].save());
    }
    chainer.run().success(function(results){
      // create matching bids and asks for all bids and asks
      if (callback) { callback(); }
    }).error(function(err){
      console.log(err);
    });


  }).error(function(err){
    console.log(err);
  });
}

var execute = function(){
  prepare(function(now, symbols){
    pretick(now, symbols, function(now, symbol){
      nextMatch(now, symbol);
    });
  });
}


var nextMatch = function(now, symbol){
  var chainer = new GAME.db.Sequelize.Utils.QueryChainer;

  chainer
    .add(
      GAME.db.Bid.find({ where: ["symbol = ? AND NOT matched AND order_placed_at <= ?", symbol, now.toUTCString()], order: "price_actual DESC, order_placed_at DESC, quantity DESC"}).error(function(err){
        console.log(err);
      })
      )
    .add(
      GAME.db.Ask.find({ where: ["symbol = ? AND NOT matched AND order_placed_at <= ?", symbol, now.toUTCString()], order: "price_actual ASC, order_placed_at DESC, quantity DESC"}).error(function(err){
        console.log(err);
      })
      )
    .run()
    .success(function(results){
      var bid = results[0];
      var ask = results[1];

      if (bid && ask){
        if (bid.values.price_actual >= ask.values.price_actual){
          // set bid actual price to ask actual price
          bid.price_actual = ask.values.price_actual;

          if (bid.values.quantity > ask.values.quantity){
            //create new bid order and update this bid and ask
            var new_bid_qty = bid.values.quantity - ask.values.quantity;
            GAME.db.Bid.create({
              symbol: bid.values.symbol,
              price_ordered: bid.values.price_ordered,
              price_actual: bid.values.price_actual,
              price_affecting: bid.values.price_affecting,
              quantity: new_bid_qty,
              buyer: bid.values.buyer
            }).success(function(newbid){
              bid.quantity = ask.values.quantity;
              createTrade(bid, ask, function(){
                nextMatch(now, symbol);
              });
            });
          } else if (bid.values.quantity < ask.values.quantity){
            //create new ask order and update this ask
            var new_ask_qty = ask.values.quantity - bid.values.quantity;
            GAME.db.Ask.create({
              symbol: ask.values.symbol,
              price_ordered: ask.values.price_ordered,
              price_actual: ask.values.price_actual,
              price_affecting: ask.values.price_affecting,
              quantity: new_ask_qty,
              seller: ask.values.seller
            }).success(function(newask){
              ask.quantity = bid.values.quantity;
              createTrade(bid, ask, function(){
                nextMatch(now, symbol);
              });
            });
          } else {
            // create trade
            createTrade(bid, ask, function(){
              nextMatch(now, symbol);
            });
          }
        } else {
          // do nothing
          console.log("positive spread, no match");
        }

      }
    })
    .error(function(err){
      console.log(err);
    });
}


// bid and ask instance MUST already be matched in price and quantity
var createTrade = function(bid, ask, callback){
  bid.matched = true;
  ask.matched = true;
  GAME.db.Trade.create({
    symbol: bid.values.symbol,
    price: ask.values.price_actual,
    quantity: bid.values.quantity,
    buyer: bid.values.buyer,
    bid: bid.values.id,
    seller: ask.values.seller,
    ask: ask.values.id
  }).success(function(trade){
    //console.log("trade created", trade.values);
    bid.save().success(function(bid){
      //console.log("bid saved");
      ask.save().success(function(ask){
        //console.log("ask saved");
        if (callback){ callback(); }
      });
    });
  }).error(function(err){
    console.log(err);
  });
}

exports.prepare = prepare;
exports.pretick = pretick;
exports.execute = execute;
exports.nextMatch = nextMatch;

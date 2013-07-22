GAME = {};

GAME.config = require('./config/config.js').config();

// set up models
GAME.db = require('./models/models.js');
var request = require('superagent');

// add interval
//

var dbError = function(err){
  console.log(err);
}

var prepare = function(callback){
  var now = new Date();

  GAME.db.sequelize.query('SELECT DISTINCT symbol FROM "Bids" WHERE NOT matched AND order_placed_at <= \''+now.toUTCString()+'\' UNION SELECT DISTINCT symbol FROM "Asks" WHERE NOT matched AND order_placed_at <= \''+now.toUTCString()+"'").success(function(symbols){
    if (callback) { callback(now, symbols); }
  }).error(dbError);

}

var pretick = function(now, symbols, middleware, callback){

  for (var i=0;i<symbols.length;i++){
    (function(){ //anon function necessary to close this_symbol

      var this_symbol = symbols[i].symbol;
      var chainer = new GAME.db.Sequelize.Utils.QueryChainer;

      chainer
        .add(
          GAME.db.Bid.findAll({ where: ["symbol = ? AND NOT matched AND order_placed_at <= ?", this_symbol, now.toUTCString()]}).error(dbError)
          )
        .add(
          GAME.db.Ask.findAll({ where: ["symbol = ? AND NOT matched AND order_placed_at <= ?", this_symbol, now.toUTCString()]}).error(dbError)
          )
        .run()
        .success(function(results){
          var bids = results[0];
          var asks = results[1];
          //console.log(this_symbol);
          //console.log(bids);
          //console.log(asks);

          // the middleware function must accept:
          // the current symbol, an array of bid objects, an array of ask objects, and a callback
          // run middleware
          if (middleware){
            middleware(this_symbol, bids, asks, function(){
              // once everything is done, call callback with THIS symbol
              if (callback) { callback(now, this_symbol); }
            });
          } else {
            if (callback) { callback(now, this_symbol); }
          }

        })
        .error(dbError);

    })();
  }
}

var muckMarket = function(symbol, bids, asks, callback){
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
  //console.log(bid_q_pa);
  //console.log(ask_q_pa);
  //console.log(bid_q);
  //console.log(ask_q);

  GAME.db.Symbol.find({ where: { symbol: symbol }}).success(function(symbol){
    var factor = ((bid_q_pa - ask_q_pa) / symbol.issued) + 1;
    //console.log("factor", factor);
    var new_price = symbol.price * factor;
    //console.log("new price", new_price);

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
      var newchainer = new GAME.db.Sequelize.Utils.QueryChainer;
      for (var b=0;b<bids.length;b++){
        newchainer.add(
          GAME.db.Ask.create({
            symbol: bids[b].symbol,
            price_ordered: bids[b].price_ordered,
            price_actual: bids[b].price_actual,
            price_affecting: false,
            quantity: bids[b].quantity,
            seller: GAME.config.agent_name
          })
          );
      }
      for (var a=0;a<asks.length;a++){
        newchainer.add(
          GAME.db.Bid.create({
            symbol: asks[a].symbol,
            price_ordered: asks[a].price_ordered,
            price_actual: asks[a].price_actual,
            price_affecting: false,
            quantity: asks[a].quantity,
            buyer: GAME.config.agent_name
          })
          );
      }
      newchainer.run().success(function(results){
        if (callback) { callback(); }
      }).error(dbError);
    }).error(dbError);


  }).error(dbError);
}

var execute = function(middleware){
  prepare(function(now, symbols){
    pretick(now, symbols, middleware, function(now, symbol){
      nextMatch(now, symbol);
    });
  });
}


var nextMatch = function(now, symbol){
  var chainer = new GAME.db.Sequelize.Utils.QueryChainer;

  chainer
    .add(
      GAME.db.Bid.find({ where: ["symbol = ? AND NOT matched AND order_placed_at <= ?", symbol, now.toUTCString()], order: "price_actual DESC, order_placed_at DESC, quantity DESC"}).error(dbError)
      )
    .add(
      GAME.db.Ask.find({ where: ["symbol = ? AND NOT matched AND order_placed_at <= ?", symbol, now.toUTCString()], order: "price_actual ASC, order_placed_at DESC, quantity DESC"}).error(dbError)
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
          //console.log("positive spread, no match");
        }

      }
    })
    .error(dbError);
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
        request.post(GAME.config.trade_callback).send({
          key: GAME.config.callback_auth_token,
          id: trade.id,
          stock_id: trade.symbol,
          number_shares: trade.quantity,
          price: trade.price,
          buyer: trade.buyer,
          bid: trade.bid,
          seller: trade.seller,
          ask: trade.ask,
          time: trade.created_at
        }).end(function(res){
          console.log(res);
        });
        if (callback){ callback(); }
      });
    });
  }).error(dbError);
}

exports.prepare = prepare;
exports.pretick = pretick;
exports.execute = execute;
exports.nextMatch = nextMatch;
exports.muckMarket = muckMarket;

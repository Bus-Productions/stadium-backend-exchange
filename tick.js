GAME = {};

GAME.config = require('./config/config.js').config();

// set up models
GAME.db = require('./models/models.js');

// add interval
//


exports.execute = function(){

  var now = new Date();
  var symbols = {};

  GAME.db.sequelize.query('SELECT DISTINCT symbol FROM "Bids" WHERE NOT matched AND order_placed_at <= \''+now.toUTCString()+'\' UNION SELECT DISTINCT symbol FROM "Asks" WHERE NOT matched AND order_placed_at <= \''+now.toUTCString()+"'").success(function(symbols){
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

            // get price change modifiers
            var bid_f = 1,
                ask_f = 1;

          })
          .error(function(err){
            console.log(err);
          });

      })();
    }
  }).error(function(err){
    console.log(err);
  });

}

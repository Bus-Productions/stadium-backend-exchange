GAME = {};

GAME.config = require('./config/config.js').config();

// set up models
GAME.db = require('./models/models.js');
var chainer = new GAME.db.Sequelize.Utils.QueryChainer;

// add interval
//


exports.execute = function(){

  var now = new Date();
  var symbols = {};

  GAME.db.sequelize.query('SELECT DISTINCT symbol FROM "Bids" WHERE NOT matched AND order_placed_at < \''+now.toUTCString()+'\' UNION SELECT DISTINCT symbol FROM "Asks" WHERE NOT matched AND order_placed_at < \''+now.toUTCString()+"'").success(function(symbols){
    console.log(symbols);
    for (var i=0;i<symbols.length;i++){
      console.log(symbols[i].symbol);
      var this_symbol = symbols[i].symbol;

      chainer
        .add(
          GAME.db.Bid.findAll({ where: ["symbol = ? AND NOT matched AND order_placed_at < ?", this_symbol, now.toUTCString()]}).error(function(err){
            console.log(err);
          })
          )
        .add(
          GAME.db.Ask.findAll({ where: ["symbol = ? AND NOT matched AND order_placed_at < ?", this_symbol, now.toUTCString()]}).error(function(err){
            console.log(err);
          })
          )
        .run()
        .success(function(results){
          console.log(results);
        })
        .error(function(err){
          console.log(err);
        });
    }
  }).error(function(err){
    console.log(err);
  });

}

GAME = {};

GAME.config = require('./config/config.js').config();

// set up models
GAME.db = require('./models/models.js');

// add interval
//

var now = new Date();
var symbols = {};

GAME.db.sequelize.query('SELECT DISTINCT symbol FROM "Bids" WHERE NOT matched AND order_placed_at < \''+now.toUTCString()+'\' UNION SELECT DISTINCT symbol FROM "Asks" WHERE NOT matched AND order_placed_at < \''+now.toUTCString()+"'").success(function(symbols){
  console.log(symbols);
}).error(function(err){
  console.log(err);
});

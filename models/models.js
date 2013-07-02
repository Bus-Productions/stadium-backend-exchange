var Sequelize = require("sequelize");
var sequelize = new Sequelize(GAME.config.dbname, GAME.config.dbuser, GAME.config.dbpass, {
  host: GAME.config.dbhost,
  port: GAME.config.dbport,
  protocol: 'postgres',
  dialect:'postgres'
});

var Symbol = require("./symbol")(sequelize, Sequelize);
var Bid = require("./bid")(sequelize, Sequelize);
var Ask = require("./ask")(sequelize, Sequelize);
var User = require("./user")(sequelize, Sequelize);

exports.Symbol = Symbol;
exports.Bid = Bid;
exports.Ask = Ask;
exports.User = User;

sequelize.sync().success(function(){
  console.log("DB Synced");
}).error(function(error){
  console.log(error);
});

exports.sequelize = sequelize;

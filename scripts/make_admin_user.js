var passwordHash = require('password-hash'),
    USER = 'admin@stadiumexchange.com',
    PASS = passwordHash.generate('game2013');


GAME = {};

GAME.config = require('../config/config.js').config();

// set up models
var Sequelize = require("sequelize");
var sequelize = new Sequelize(GAME.config.dbname, GAME.config.dbuser, GAME.config.dbpass, {
  host: GAME.config.dbhost,
  port: GAME.config.dbport,
  protocol: 'postgres',
  dialect:'postgres'
});

var User = require("../models/user")(sequelize, Sequelize);

sequelize.sync().success(function(){
  console.log("DB Synced");

  User.findOrCreate({
    email: USER
  },{
    password: PASS,
    admin: true
  }).success(function(user){
    console.log('Successfully created Admin user: ');
    console.log(user.values);
  }).error(function(err){
    console.log(err);
  });

}).error(function(error){
  console.log(error);
});

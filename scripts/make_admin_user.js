var passwordHash = require('password-hash');

GAME = {};

GAME.config = require('../config/config.js').config();

var USER = GAME.config.admin_user,
    PASS = passwordHash.generate(GAME.config.admin_pass);

// set up models
var Sequelize = require("sequelize");
var sequelize = new Sequelize(GAME.config.dbname, GAME.config.dbuser, GAME.config.dbpass, {
  host: GAME.config.dbhost,
  port: GAME.config.dbport,
  logging: GAME.config.logging,
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

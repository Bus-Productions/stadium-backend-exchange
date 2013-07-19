var should = require('chai').should(),
    config = require('../config/config.js').config(),
    db = require('../models/models.js'),
    helpers = require('./utils/helpers.js'),
    request = require('supertest'),
    app  = require('../server'),
    tick = require('../tick');

var USER = 'admin@stadiumexchange.com',
    PASS = 'game2013';

describe("Scenarios - Non Price Affecting", function() {

  describe("0 bid, 0 ask - no trade:", function() {
    it ('should run the tick and have no trades',function(done) {
      tick.execute();
      setTimeout(function(){
        request(app).get('/trade/A')
          .auth(USER, PASS)
          .expect(200, function(err, res){
            res.body.length.should.equal(0);
            helpers.report_error(err, res, done);
          });
      },100);
    });
  });

  describe("1 bid, 1 ask - perfect match:", function() {
    before( function(done) { helpers.post_symbol('BBB',100,1000,done) } );
    before( function(done) { helpers.post_bid('BBB',100,100,true,done) } );
    before( function(done) { helpers.post_bid('BBB',100,100,true,done) } );
    before( function(done) { helpers.post_ask('BBB',100,100,true,done) } );

    it ('should run the tick and have one trade',function(done) {
      tick.execute();
      setTimeout(function(){
        request(app).get('/trade/BBB')
          .auth(USER, PASS)
          .expect(200, function(err, res){
            res.body.length.should.equal(1);
            res.body[0].symbol.should.equal('BBB');
            res.body[0].buyer.should.equal('Mr White');
            helpers.report_error(err, res, done);
          });
      },100);
    });
  });

  describe("2 bid, 1 ask - mismatch quantity:", function() {
    before( function(done) { helpers.post_symbol('BBC', 100, 1000, done) } );
    before( function(done) { helpers.post_bid('BBC',100,40,false,done) } );
    before( function(done) { helpers.post_bid('BBC',100,60,false,done) } );
    before( function(done) { helpers.post_ask('BBC',100,100,false,done) } );

    it ('should run the tick and have 2 trades and no remaining bids/asks',function(done) {
      tick.execute();
      setTimeout(function(){
        request(app).get('/trade/BBC')
          .auth(USER,PASS)
          .expect(200, function(err, res) {
            res.body.length.should.equal(2);
            helpers.report_error(err, res, done);
          });
      },100);
    });
  });
});

describe("Scenarios - Price Affecting", function() {
  it ('should fucking work');
  it ('should run the tick and have 1 trade and no remaining bids/asks');

//describe("1 bid, 2 ask - mismatch quantity:", function() { });
//describe(" bid,  ask - mismatch quantity:", function() { });
//describe(" bid,  ask - match quantity:", function() { });

  describe("1 bid, 1 ask, matching quantities", function() {
    before( function(done) { helpers.post_symbol('FFFF', 100, 1000, done) } );
    before( function(done) { helpers.post_bid('FFFF',100,100,true,done) } );
    before( function(done) { helpers.post_ask('FFFF',100,100,true,done) } );

    it ('should run the tick and have 1 trade and no remaining bids/asks', function(done) {
      tick.execute();
      setTimeout(function(){
        request(app).get('/trade/FFFF')
          .auth(USER, PASS)
          .expect(200, function(err, res){
            res.body.length.should.equal(1);
            res.body[0].symbol.should.equal('FFFF');
            res.body[0].buyer.should.equal('Mr White');
            res.body[0].quantity.should.equal(100);
            db.Bid.findAll({where: {symbol: 'FFFF'}})
              .success(function(bid) {
                bid.length.should.equal(1);
                bid[0].matched.should.equal(true);
                db.Ask.findAll({where: {symbol: 'FFFF'}})
                  .success(function(ask) {
                    ask.length.should.equal(1);
                    ask[0].matched.should.equal(true);
                    helpers.report_error( err, res, done);
                  }).error(function(err) {
                    console.log(ask);
                    helpers.report_error( err, res, done);
                  });
              }).error(function(err) {
                console.log(bid);
                helpers.report_error( err, res, done);
              });
          });
      },100);
    });
  });
});

describe("Scenarios - Muck Market", function() {
  it ('should run the tick and have 6 trades and no remaining bids/asks');

  describe("2 bid, 1 ask - mismatch quantity:", function() {
    before( function(done) { helpers.post_symbol('MMM', 100, 1000, done) } );
    before( function(done) { helpers.post_bid('MMM',100,40,false,done) } );
    before( function(done) { helpers.post_bid('MMM',100,60,false,done) } );
    before( function(done) { helpers.post_ask('MMM',100,100,false,done) } );

    it ('should run the tick and have 3 trades and no remaining bids/asks',function(done) {
      tick.execute(tick.muckMarket);
      setTimeout(function(){
        request(app).get('/trade/MMM')
          .auth(USER,PASS)
          .expect(200, function(err, res) {
            res.body.length.should.equal(3);
            helpers.report_error(err, res, done);
          });
      },100);
    });
  });

});

process.env.NODE_ENV = 'test';

var should = require('chai').should(),
    config = require('../config/config.js').config(),
    db = require('../models/models.js'),
    request = require('supertest'),
    app  = require('../server'),
    tick = require('../tick');

var USER = 'admin@stadiumexchange.com',
    PASS = 'game2013';

// helpers
var report_error = function(err, res, done) {
  if (err) {
    console.log(res.body);
    return done(err);
  } else {
    done();
  }
}

var post_bid = function(symbol,price,qty,pa,done) {
  request(app).post('/bid')
    .send({ symbol: symbol, price: price, quantity: qty, buyer: 'Mr White', price_affecting: pa })
    .auth(USER, PASS)
    .expect(201,done);
};

var post_ask = function(symbol,price,qty,pa,done) {
  request(app).post('/ask')
    .send({ symbol: symbol, price: price, quantity: qty, seller: 'Mr White', price_affecting: pa })
    .auth(USER, PASS)
    .expect(201,done);
};

// surrounds
before(function() {
  //console.log("Initializing the application");
});

after(function() {
  //console.log("Finishing the tests");
});

describe("Scenarios - Non Price Affecting", function() {

  describe("0 bid, 0 ask - no trade:", function() {
    it ('should run the tick and have no trades',function(done) {
      tick.execute();
      setTimeout(function(){
        request(app).get('/trade/A')
          .auth(USER, PASS)
          .expect(200, function(err, res){
            res.body.length.should.equal(0);
            report_error(err, res, done);
          });
      },100);
    });
  });

<<<<<<< HEAD
describe("1 bid, 1 ask - perfect match:", function() {
  before( function(done) { post_bid('BBB',100,100,true,done) } );
  before( function(done) { post_ask('BBB',100,100,true,done) } );

  before( function(done) {
    request(app).post('/symbol')
      .send({ symbol: 'BBB', price: 100, issued: 1000 })
      .auth(USER, PASS)
      .expect(201,done);
  });

  it ('should run the tick and have one trade',function(done) {
    tick.execute();
    setTimeout(function(){
      request(app).get('/trade/BBB')
        .auth(USER, PASS)
        .expect(200, function(err, res){
          res.body.length.should.equal(1);
          res.body[0].symbol.should.equal('BBB');
          res.body[0].buyer.should.equal('Mr White');
          report_error(err, res, done);
        });
      },100);
    });
  });

  describe("2 bid, 1 ask - mismatch quantity:", function() {
    before( function(done) { post_bid('BBC',100,40,false,done) } );
    before( function(done) { post_bid('BBC',100,60,false,done) } );
    before( function(done) { post_ask('BBC',100,100,false,done) } );

    it ('should run the tick and have 2 trades and no remaining bids/asks',function(done) {
      tick.execute();
      setTimeout(function(){
        request(app).get('/trade/BBC')
          .auth(USER,PASS)
          .expect(200, function(err, res) {
            res.body.length.should.equal(2);
            report_error(err, res, done);
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
    before( function(done) { post_bid('FFFF',100,100,true,done) } );
    before( function(done) { post_ask('FFFF',100,100,true,done) } );

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
            report_error(err, res, done);
          });
      },100);
    });
  });
});

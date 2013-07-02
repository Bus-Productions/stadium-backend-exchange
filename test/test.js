process.env.NODE_ENV = 'test';

var should = require('chai').should(),
    supertest = require('supertest'),
    config = require('../config/config.js').config(),
    app = require('../server'),
    passwordHash = require('password-hash'),
    api = supertest('http://localhost:3000');

var USER = 'admin@stadiumexchange.com',
    PASS = 'game2013';

//var Sequelize = require("sequelize");
//var sequelize = new Sequelize(config.dbname, config.dbuser, config.dbpass, {
//  host: config.dbhost,
//  port: config.dbport,
//  protocol: 'postgres',
//  dialect:'postgres'
//});

// helpers
var report_error = function(err, res, done) {
  if (err) {
    console.log(res.body);
    return done(err);
  } else {
    done();
  }
}

// surrounds
before(function() {
  console.log("Initializing the application");
});

//after(function(done) {
//  sequelize.query('DELETE FROM "Bids"').success(function(myTableRows) {
//    console.log(myTableRows);
//    done();
//  })
//  .error(function(err) {
//    console.log(err);
//  });
//});

// *****
// TESTS
// *****

describe("Index", function() {
  it('gets the index page', function(done) {
    api.get('/')
      .expect(200, function(err,res) {
        console.log(res.body);
        report_error(err,res,done);
      });
  });

  it('has a healthcheck', function(done) {
    api.get('/healthcheck')
      .expect(200, done);
  });
});

describe("Auth", function() {
  it('will fail authorization', function(done) {
    api.get("/bid/1")
      .expect(401, function(err, res){
        report_error(err, res, done);
      });
  });
});

describe("Bid", function() {
  it('can post a bid', function(done) {
    api.post('/bid')
    //tock Ticker Symbol, Bid Amount, Bid Quantity, Buyer ID
      .send({ symbol: 'AAA', price: 100.0, quantity: 100, buyer: 'Mr White' })
      .auth(USER, PASS)
      .expect(201)
      .end(function(err, res){
        report_error(err, res, done);
      });
  });

  it('can get a bid', function(done) {
    api.get("/bid/1")
      .auth(USER, PASS)
      .expect(200, function(err, res){
        res.body.symbol.should.equal('AAA');
        res.body.price.should.equal(100);
        res.body.quantity.should.equal(100);
        res.body.buyer.should.equal('Mr White');
        res.body.id.should.equal(1);
        report_error(err, res, done);
      });
  });

  describe('failure scenarios', function() {
    it('needs to have a record associated with a bid', function(done) {
      api.get('/bid/1223')
        .auth(USER, PASS)
        .expect(404)
        .end(function(err,res){
          report_error(err, res, done);
        });
    });
    it('needs to have an integer value for order_id', function(done) {
      api.get('/bid/asdf')
        .auth(USER, PASS)
        .expect(400)
        .end(function(err,res){
          report_error(err, res, done);
        });
    });
    it('needs a bid quantity', function(done) {
      api.post('/bid')
        .send({ symbol: 'AAA', price: 100.0, buyer: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/quantity/);
          report_error(err, res, done);
        });
    });
    it('needs a bid symbol', function(done) {
      api.post('/bid')
        .send({ quantity: 100, price: 100.0, buyer: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/symbol/);
          report_error(err, res, done);
        });
    });
    it('needs a bid price', function(done) {
      api.post('/bid')
        .send({ symbol: 'AAA', quantity: 100, buyer: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/price/);
          report_error(err, res, done);
        });
    });
    it('needs a bid buyer', function(done) {
      api.post('/bid')
        .send({ symbol: 'AAA', price: 100.0, quantity: 100 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/buyer/);
          report_error(err, res, done);
        });
    });
    it('needs a bid buyer and a symbol', function(done) {
      api.post('/bid')
        .send({ price: 100.0, quantity: 100 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/buyer/);
          res.text.should.match(/symbol/);
          report_error(err, res, done);
        });
    });
  });
});

describe("Ask", function() {
  it('can post a ask', function(done) {
    api.post('/ask')
    //tock Ticker Symbol, Ask Amount, Ask Quantity, Buyer ID
      .send({ symbol: 'AAA', price: 100.0, quantity: 100, seller: 'Mr White' })
      .auth(USER, PASS)
      .expect(201)
      .end(function(err, res){
        report_error(err, res, done);
      });
  });

  it('can get a ask', function(done) {
    api.get("/ask/1")
      .auth(USER, PASS)
      .expect(200, function(err, res){
        res.body.symbol.should.equal('AAA');
        res.body.price.should.equal(100);
        res.body.quantity.should.equal(100);
        res.body.seller.should.equal('Mr White');
        res.body.id.should.equal(1);
        report_error(err, res, done);
      });
  });

  describe('failure scenarios', function() {
    it('needs to have a record associated with a ask', function(done) {
      api.get('/ask/1223')
        .auth(USER, PASS)
        .expect(404)
        .end(function(err,res){
          report_error(err, res, done);
        });
    });
    it('needs to have an integer value for order_id', function(done) {
      api.get('/ask/asdf')
        .auth(USER, PASS)
        .expect(400)
        .end(function(err,res){
          report_error(err, res, done);
        });
    });
    it('needs a ask quantity', function(done) {
      api.post('/ask')
        .send({ symbol: 'AAA', price: 100.0, seller: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/quantity/);
          report_error(err, res, done);
        });
    });
    it('needs a ask symbol', function(done) {
      api.post('/ask')
        .send({ quantity: 100, price: 100.0, seller: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/symbol/);
          report_error(err, res, done);
        });
    });
    it('needs a ask price', function(done) {
      api.post('/ask')
        .send({ symbol: 'AAA', quantity: 100, seller: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/price/);
          report_error(err, res, done);
        });
    });
    it('needs a ask seller', function(done) {
      api.post('/ask')
        .send({ symbol: 'AAA', price: 100.0, quantity: 100 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/seller/);
          report_error(err, res, done);
        });
    });
    it('needs a ask seller and a symbol', function(done) {
      api.post('/ask')
        .send({ price: 100.0, quantity: 100 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/seller/);
          res.text.should.match(/symbol/);
          report_error(err, res, done);
        });
    });
  });
});


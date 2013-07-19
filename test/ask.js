var should = require('chai').should(),
    request = require('supertest'),
    helpers = require('./utils/helpers.js'),
    config = require('../config/config.js').config(),
    app = require('../server');

var USER = 'admin@stadiumexchange.com',
    PASS = 'game2013';

before(function(done) { helpers.post_symbol('ASK', 100, 100, done) });

describe("Ask", function() {
  it('can post a ask', function(done) {
    request(app).post('/ask')
    //tock Ticker Symbol, Ask Amount, Ask Quantity, Buyer ID
      .send({ symbol: 'ASK', price: 100.0, quantity: 100, seller: 'Mr White' })
      .auth(USER, PASS)
      .expect(201)
      .end(function(err, res){
        helpers.report_error(err, res, done);
      });
  });

  it('can get a ask', function(done) {
    request(app).get("/ask/1")
      .auth(USER, PASS)
      .expect(200, function(err, res){
        res.body.symbol.should.equal('ASK');
        res.body.price_ordered.should.equal(100);
        res.body.quantity.should.equal(100);
        res.body.seller.should.equal('Mr White');
        res.body.id.should.equal(1);
        helpers.report_error(err, res, done);
      });
  });

  describe('failure scenarios', function() {
    it('needs to have a record associated with a ask', function(done) {
      request(app).get('/ask/1223')
        .auth(USER, PASS)
        .expect(404)
        .end(function(err,res){
          helpers.report_error(err, res, done);
        });
    });
    it('needs to have an integer value for order_id', function(done) {
      request(app).get('/ask/asdf')
        .auth(USER, PASS)
        .expect(400)
        .end(function(err,res){
          helpers.report_error(err, res, done);
        });
    });
    it('needs a ask quantity', function(done) {
      request(app).post('/ask')
        .send({ symbol: 'ASK', price: 100.0, seller: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/quantity/);
          helpers.report_error(err, res, done);
        });
    });
    it('needs a ask symbol', function(done) {
      request(app).post('/ask')
        .send({ quantity: 100, price: 100.0, seller: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/symbol/);
          helpers.report_error(err, res, done);
        });
    });
    it('needs a ask price', function(done) {
      request(app).post('/ask')
        .send({ symbol: 'ASK', quantity: 100, seller: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/price/);
          helpers.report_error(err, res, done);
        });
    });
    it('needs a ask seller', function(done) {
      request(app).post('/ask')
        .send({ symbol: 'ASK', price: 100.0, quantity: 100 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/seller/);
          helpers.report_error(err, res, done);
        });
    });
    it('needs a ask seller and a symbol', function(done) {
      request(app).post('/ask')
        .send({ price: 100.0, quantity: 100 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/seller/);
          res.text.should.match(/symbol/);
          helpers.report_error(err, res, done);
        });
    });
  });
});

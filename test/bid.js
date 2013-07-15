process.env.NODE_ENV = 'test';

var should = require('chai').should(),
    request = require('supertest'),
    config = require('../config/config.js').config(),
    app = require('../server');

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

describe("Bid", function() {
  it('can post a bid', function(done) {
    request(app).post('/bid')
    //tock Ticker Symbol, Bid Amount, Bid Quantity, Buyer ID
      .send({ symbol: 'AAA', price: 100.0, quantity: 100, buyer: 'Mr White' })
      .auth(USER, PASS)
      .expect(201)
      .end(function(err, res){
        report_error(err, res, done);
      });
  });

  it('can get a bid', function(done) {
    request(app).get("/bid/1")
      .auth(USER, PASS)
      .expect(200, function(err, res){
        res.body.symbol.should.equal('AAA');
        res.body.price_ordered.should.equal(100);
        res.body.quantity.should.equal(100);
        res.body.buyer.should.equal('Mr White');
        res.body.id.should.equal(1);
        report_error(err, res, done);
      });
  });

  describe('failure scenarios', function() {
    it('needs to have a record associated with a bid', function(done) {
      request(app).get('/bid/1223')
        .auth(USER, PASS)
        .expect(404)
        .end(function(err,res){
          report_error(err, res, done);
        });
    });
    it('needs to have an integer value for order_id', function(done) {
      request(app).get('/bid/asdf')
        .auth(USER, PASS)
        .expect(400)
        .end(function(err,res){
          report_error(err, res, done);
        });
    });
    it('needs a bid quantity', function(done) {
      request(app).post('/bid')
        .send({ symbol: 'AAA', price: 100.0, buyer: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/quantity/);
          report_error(err, res, done);
        });
    });
    it('needs a bid symbol', function(done) {
      request(app).post('/bid')
        .send({ quantity: 100, price: 100.0, buyer: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/symbol/);
          report_error(err, res, done);
        });
    });
    it('needs a bid price', function(done) {
      request(app).post('/bid')
        .send({ symbol: 'AAA', quantity: 100, buyer: 'Mr White' })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/price/);
          report_error(err, res, done);
        });
    });
    it('needs a bid buyer', function(done) {
      request(app).post('/bid')
        .send({ symbol: 'AAA', price: 100.0, quantity: 100 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/buyer/);
          report_error(err, res, done);
        });
    });
    it('needs a bid buyer and a symbol', function(done) {
      request(app).post('/bid')
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


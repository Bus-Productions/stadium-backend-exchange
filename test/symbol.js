var should = require('chai').should(),
    request = require('supertest'),
    helpers = require('./utils/helpers.js'),
    config = require('../config/config.js').config(),
    app = require('../server');

var USER = 'admin@stadiumexchange.com',
    PASS = 'game2013';

describe("Symbol", function() {
  it('can create a symbol', function(done) {
    request(app).post('/symbol')
    //tock Ticker Symbol, Bid Amount, Bid Quantity, Buyer ID
      .send({ symbol: 'AAA', price: 100.0, issued: 100 })
      .auth(USER, PASS)
      .expect(201)
      .end(function(err, res){
        helpers.report_error(err, res, done);
      });
  });

  it('can get a symbol', function(done) {
    request(app).get("/symbol/AAA")
      .auth(USER, PASS)
      .expect(200, function(err, res){
        res.body.symbol.should.equal('AAA');
        res.body.price.should.equal(100);
        res.body.issued.should.equal(100);
        helpers.report_error(err, res, done);
      });
  });

  describe('failure scenarios', function() {
    it('needs to have a valid symbol', function(done) {
      request(app).get('/symbol/1223')
        .auth(USER, PASS)
        .expect(404)
        .end(function(err,res){
          helpers.report_error(err, res, done);
        });
    });
    it('needs a issued quantity', function(done) {
      request(app).post('/symbol')
        .send({ symbol: 'AAA', price: 100.0 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/issued/);
          helpers.report_error(err, res, done);
        });
    });
    it('needs a symbol', function(done) {
      request(app).post('/symbol')
        .send({ issued: 100, price: 100.0 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/symbol/);
          helpers.report_error(err, res, done);
        });
    });
    it('needs a price', function(done) {
      request(app).post('/symbol')
        .send({ symbol: 'AAA', issued: 100 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/price/);
          helpers.report_error(err, res, done);
        });
    });
    it('needs a price and a symbol', function(done) {
      request(app).post('/symbol')
        .send({ issued: 100 })
        .auth(USER, PASS)
        .expect(400, function(err, res){
          res.text.should.match(/price/);
          res.text.should.match(/symbol/);
          helpers.report_error(err, res, done);
        });
    });
  });
});

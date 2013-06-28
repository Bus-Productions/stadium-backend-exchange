process.env.NODE_ENV = 'test';

var should = require('chai').should(),
    supertest = require('supertest'),
    config = require('../config/config.js').config(),
    app = require('../server'),
    api = supertest('http://localhost:3000');

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

describe("Bid", function() {
  it('can post a bid', function(done) {
    api.post('/bid')
    //tock Ticker Symbol, Bid Amount, Bid Quantity, Buyer ID
      .send({ symbol: 'AAA', price: 100.0, quantity: 100, buyer: 'Mr White' })
      .expect(201)
      .end(function(err, res){
        report_error(err, res, done);
      });
  });

  it('can get a bid', function(done) {
    api.get("/bid/1")
      .expect(200)
      .end(function(err, res){
        console.log(err);
        report_error(err, res, done);
      });
  });

  describe('failure scenarios', function() {
    it('needs to have a record associated with a bid', function(done) {
      api.get('/bid/1223')
        .expect(404)
        .end(function(err,res){
          report_error(err, res, done);
        });
    });
    it('needs to have an integer value for order_id', function(done) {
      api.get('/bid/asdf')
        .expect(400)
        .end(function(err,res){
          report_error(err, res, done);
        });
    });
    it('needs a bid quantity', function(done) {
      api.post('/bid')
        .send({ symbol: 'AAA', price: 100.0, buyer: 'Mr White' })
        .expect(400, function(err, res){
          res.text.should.match(/quantity/);
          report_error(err, res, done);
        });
    });
    it('needs a bid symbol', function(done) {
      api.post('/bid')
        .send({ quantity: 100, price: 100.0, buyer: 'Mr White' })
        .expect(400, function(err, res){
          res.text.should.match(/symbol/);
          report_error(err, res, done);
        });
    });
    it('needs a bid price', function(done) {
      api.post('/bid')
        .send({ symbol: 'AAA', quantity: 100, buyer: 'Mr White' })
        .expect(400, function(err, res){
          res.text.should.match(/price/);
          report_error(err, res, done);
        });
    });
    it('needs a bid buyer', function(done) {
      api.post('/bid')
        .send({ symbol: 'AAA', price: 100.0, quantity: 100 })
        .expect(400, function(err, res){
          res.text.should.match(/buyer/);
          report_error(err, res, done);
        });
    });
    it('needs a bid buyer and a symbol', function(done) {
      api.post('/bid')
        .send({ price: 100.0, quantity: 100 })
        .expect(400, function(err, res){
          res.text.should.match(/buyer/);
          res.text.should.match(/symbol/);
          report_error(err, res, done);
        });
    });
  });
});

process.env.NODE_ENV = 'test';

var should = require('chai').should(),
    config = require('../config/config.js').config(),
    sequelize = require('../models/models.js').sequelize,
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

var post_bid = function(symbol,done) {
  request(app).post('/bid')
    .send({ symbol: symbol, price: 100.0, quantity: 100, buyer: 'Mr White' })
    .auth(USER, PASS)
    .expect(201,done);
};

var post_ask = function(symbol,done) {
  request(app).post('/ask')
    .send({ symbol: symbol, price: 100.0, quantity: 100, seller: 'Mr White' })
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

describe("Scenario1", function() {
  before( function(done) { post_bid('AAA',done) } );
  before( function(done) { post_bid('BBB',done) } );
  before( function(done) { post_ask('CCC',done) } );
  before( function(done) { post_ask('DDD',done) } );

  it ('should run the tick and have one 1 trade',function(done) {
    tick.execute();
    request(app).get('/trade/AAA')
      .auth(USER, PASS)
      .expect(200, function(err, res){
        res.text.should.match(/AAA/);
        res.text.should.match(/Mr White/);
        res.text.should.match(/StadiumAPP/);
        report_error(err, res, done);
      });
  });
});

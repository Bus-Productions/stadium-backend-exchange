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

describe("Scenario1", function() {
  before( function(done) { post_bid('AAA',110,100,false,done) } );
  before( function(done) { post_bid('BBB',100,90,true,done) } );
  before( function(done) { post_bid('BBB',100,100,true,done) } );
  before( function(done) { post_ask('BBB',100,90,true,done) } );
  before( function(done) { post_ask('BBB',100,100,true,done) } );
  before( function(done) { post_bid('CCC',100,90,true,done) } );
  before( function(done) { post_bid('CCC',100,95,true,done) } );
  before( function(done) { post_ask('CCC',100,90,true,done) } );
  before( function(done) { post_ask('CCC',100,95,false,done) } );

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

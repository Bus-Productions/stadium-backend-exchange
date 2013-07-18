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
  before( function(done) { post_bid('AAA',110,120,false,done) } );
  before( function(done) { post_ask('AAA',100,50,false,done) } );
  before( function(done) { post_ask('AAA',100,80,false,done) } );
  before( function(done) { post_bid('BBB',100,90,true,done) } );
  before( function(done) { post_bid('BBB',100,100,true,done) } );
  before( function(done) { post_ask('BBB',100,90,true,done) } );
  before( function(done) { post_ask('BBB',100,110,true,done) } );
  before( function(done) { post_bid('CCC',100,90,true,done) } );
  //before( function(done) { post_bid('CCC',100,95,true,done) } );
  before( function(done) { post_ask('CCC',110,90,true,done) } );
  //before( function(done) { post_ask('CCC',100,95,false,done) } );

  it ('should run the tick and have one 4 trades',function(done) {
    tick.execute();
    setTimeout(function(){
      request(app).get('/trade/AAA')
        .auth(USER, PASS)
        .expect(200, function(err, res){
          console.log(res.body.length);
          //res.body[1].symbol.should.equal('AAA');
          //res.body[1].buyer.should.equal('Mr White');
          //res.body.seller.should.equal('StadiumAPP');
          res.body.length.should.equal(4);
          report_error(err, res, done);
        });
    },100);
  });

});

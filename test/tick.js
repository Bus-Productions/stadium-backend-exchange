var should = require('chai').should(),
    helpers = require('./utils/helpers.js'),
    request = require('supertest'),
    app  = require('../server'),
    tick = require('../tick');

var USER = 'admin@stadiumexchange.com',
    PASS = 'game2013';

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

  it ('should run the tick and have one 1 trade',function(done) {
    tick.execute();
    request(app).get('/trade/AAA')
      .auth(USER, PASS)
      .expect(200, function(err, res){
        res.body.symbol.should.equal('AAA');
        res.body.buyer.should.equal('Mr White');
        res.body.seller.should.equal('StadiumAPP');
        helpers.report_error(err, res, done);
      });
  });

  after( function(done) { setTimeout(function(){ done();},1000); });
});

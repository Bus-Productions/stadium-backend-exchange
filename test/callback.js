var should  = require('chai').should(),
    nock    = require('nock'),
    helpers = require('./utils/helpers.js'),
    tick = require('../tick');
    request = require('supertest');

nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1');
request = request('https://www.stadiumse.com');

var scope = {};

after( function() {
  nock.enableNetConnect();
});

describe("Callback", function() {
  before( function() {
    scope = nock('https://www.stadiumse.com')
      .persist()
      .post('/game_api/trade')
      .reply(201)
      .post('/game_api/symbol')
      .reply(202);
  });

  before( function(done) { helpers.post_symbol('XXX',100,1000,done) } );
  before( function(done) { helpers.post_bid('XXX',100,100,true,done) } );
  before( function(done) { tick.execute(); done() });

  // these are the two calls that should happen
  //before( function(done) { request.get('/game_api/trade').expect(201, done) } );
  //before( function(done) { request.get('/game_api/symbol').expect(202, done) } );

  // uncomment these to set up the test

  it('should send a trade', function() {
    scope.isDone().should.equal(true); // will throw an assertion error
  });
});

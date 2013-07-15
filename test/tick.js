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

// surrounds
before(function() {
  //console.log("Initializing the application");
});

after(function() {
  //console.log("Finishing the tests");
});

describe("Scenario1", function() {
  before(function(done) {
    //tock Ticker Symbol, Bid Amount, Bid Quantity, Buyer ID
    request(app).post('/bid')
      .send({ symbol: 'AAA', price: 100.0, quantity: 100, buyer: 'Mr White' })
      .auth(USER, PASS)
      .expect(201,done);
  });

  it ('should run the tick and have one 1 trade',function(done) {
    request(app).get('/trade/AAA')
      .auth(USER, PASS)
      .expect(200,done);
  });
});

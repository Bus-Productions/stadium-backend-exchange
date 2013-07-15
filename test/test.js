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

// surrounds
before(function() {
  //console.log("Initializing the application");
});

after(function() {
  //console.log("Finishing the tests");
});

// *****
// TESTS
// *****

describe("Index", function() {
  it('gets the index page', function(done) {
    request(app).get('/')
      .expect(200, function(err,res) {
        console.log(res.body);
        report_error(err,res,done);
      });
  });

  it('has a healthcheck', function(done) {
    request(app).get('/healthcheck')
      .expect(200, done);
  });
});

describe("Auth", function() {
  it('will fail authorization', function(done) {
    request(app).get("/bid/1")
      .expect(401, function(err, res){
        report_error(err, res, done);
      });
  });
});


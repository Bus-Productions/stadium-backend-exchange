process.env.NODE_ENV = 'test';

var should = require('chai').should(),
    request = require('supertest'),
    helpers = require('./utils/helpers.js'),
    config = require('../config/config.js').config(),
    app = require('../server');

var USER = 'admin@stadiumexchange.com',
    PASS = 'game2013';

describe("Index", function() {
  it('gets the index page', function(done) {
    request(app).get('/')
      .expect(200, function(err,res) {
        console.log(res.body);
        helpers.report_error(err,res,done);
      });
  });

  it('has a healthcheck', function(done) {
    request(app).get('/healthcheck')
      .auth(USER, PASS)
      .expect(200, done);
  });
});

describe("Auth", function() {
  it('will fail authorization', function(done) {
    request(app).get("/bid/1")
      .expect(401, function(err, res){
        helpers.report_error(err, res, done);
      });
  });
});


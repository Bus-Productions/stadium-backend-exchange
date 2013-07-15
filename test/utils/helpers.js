var should = require('chai').should(),
    config = require('../../config/config.js').config(),
    sequelize = require('../../models/models.js').sequelize,
    request = require('supertest'),
    app  = require('../../server'),
    tick = require('../../tick');

var USER = 'admin@stadiumexchange.com',
    PASS = 'game2013';

exports.report_error = function(err, res, done) {
  if (err) {
    return done(err);
  } else {
    done();
  }
}

exports.post_bid = function(symbol,done) {
  request(app).post('/bid')
    .send({ symbol: symbol, price: 100.0, quantity: 100, buyer: 'Mr White' })
    .auth(USER, PASS)
    .expect(201,done);
};

exports.post_ask = function(symbol,done) {
  request(app).post('/ask')
    .send({ symbol: symbol, price: 100.0, quantity: 100, seller: 'Mr White' })
    .auth(USER, PASS)
    .expect(201,done);
};


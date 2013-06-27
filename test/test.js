var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

describe("Index", function() {
  it('gets the index page', function(done) {
    api.get('/')
      .expect(200, done)
  });
});

describe("Index", function() {
  it('has a healthcheck', function(done) {
    api.get('/healthcheck')
      .expect(200, done)
  });
});

var report_error = function(err, res) {
  if (err) {
    console.log(res.body);
    return done(err);
  }
  done()
}

describe("Bid", function() {
  it('can post a bid', function(done) {
    api.post('/bid')
    //tock Ticker Symbol, Bid Amount, Bid Quantity, Buyer ID
      .send({ symbol: 'AAA', price: 100.0, quantity: 100, buyer: 'Mr White' })
      .expect(201)
      .end(report_error)
  });

  it('can get a bid', function(done) {
    api.get("/bid/1")
      .expect(200)
      .end(report_error)
  });

  describe('failure scenarios', function() {
    it('needs a bid quantity', function(done) {
      api.post('/bid')
        .send({ symbol: 'AAA', price: 100.0, buyer: 'Mr White' })
        .expect(400)
        .end(report_error)
    });
    it('needs a bid symbol', function(done) {
      api.post('/bid')
        .send({ quantity: 100, price: 100.0, buyer: 'Mr White' })
        .expect(400)
        .end(report_error)
    });
    it('needs a bid price', function(done) {
      api.post('/bid')
        .send({ symbol: 'AAA', quantity: 100, buyer: 'Mr White' })
        .expect(400)
        .end(report_error)
    });
    it('needs a bid buyer', function(done) {
      api.post('/bid')
        .send({ symbol: 'AAA', price: 100.0, quantity: 100 })
        .expect(400)
        .end(report_error)
    });
  });
});
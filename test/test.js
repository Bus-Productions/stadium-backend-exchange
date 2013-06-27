var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

describe("Index", function() {
  it('gets the index page', function(done) {
    api.get('/')
      .expect(200, done)
  });
});

//console.log(process.env);
//

var express = require('express')
  , app = express()
  , passport = require('passport');

// load auth schemes
var auth = require('./lib/auth');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: "vegetable meat" }));
app.use(passport.initialize());

GAME = {};

GAME.config = require('./config/config.js').config();

if ( GAME.config.logging ) {
  app.use(express.logger());
}

// set up models
GAME.db = require('./models/models.js');

// load routes
var page = require('./routes/page'),
    bid = require('./routes/bid'),
    ask = require('./routes/ask'),
    symbol = require('./routes/symbol'),
    util = require('./routes/util');


app.get('/', page.index);

// bid routes
app.post('/bid', passport.authenticate('basic', { session: false }), bid.create_bid);
app.get('/bid/:order_id', passport.authenticate('basic', { session: false }), bid.bid_status);

// ask routes
app.post('/ask', passport.authenticate('basic', { session: false }), ask.create_ask);
app.get('/ask/:order_id', passport.authenticate('basic', { session: false }), ask.ask_status);

// symbol routes
app.post('/symbol', passport.authenticate('basic', { session: false }), symbol.create_symbol);
app.get('/symbol/:symbol', passport.authenticate('basic', { session: false }), symbol.get_symbol);

// utility routes
app.get('/healthcheck', util.healthcheck);

module.exports = app;
app.listen(GAME.config.port);

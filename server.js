//console.log(process.env);
//

var express = require('express')
  , app = express()
//  , server = require('http').createServer(app)
//  , io = require('socket.io').listen(server)
//  , http = require('http')
  , passport = require('passport')
  , passwordHash = require('password-hash')
  , flash = require('connect-flash')
  , LocalStrategy = require('passport-local').Strategy;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: "vegetable meat" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

GAME = {};

GAME.config = require('./config/config.js').config();

// set up models
GAME.db = require('./models/models.js');

// load auth schemes
//var auth = require('./lib/auth');

// load routes
var page = require('./routes/page'),
    bid = require('./routes/bid'),
    //ask = require('./routes/ask'),
    util = require('./routes/util');


app.get('/', page.index);

// bid routes
app.post('/bid', bid.create_bid);


// utility routes
app.get('/healthcheck', util.healthcheck);


app.listen(GAME.config.port);

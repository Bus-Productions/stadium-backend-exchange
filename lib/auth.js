var passport = require('passport')
  , passwordHash = require('password-hash')
  //, FacebookStrategy = require('passport-facebook').Strategy
  , LocalStrategy = require('passport-local').Strategy;

/*
var FACEBOOK_APP_ID = config.facebook_app_id;
var FACEBOOK_APP_SECRET = config.facebook_app_secret;
var FACEBOOK_CALLBACK_URL = config.facebook_callback_url;
*/

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  GAME.db.User.find(id).success(function(user) {
    done(null, user);
  }).error(function(error){
    done(error);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    GAME.db.User.find({ where: {email: username} }).success(function(user){
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!passwordHash.verify(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }).error(function(error){
      return done(error);
    });
  }
));

/*
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      db.User.find({ where: {facebookid: profile.id} }).success(function(user){
        if (user){
          return done(null, user);
        } else {
          // user not found - handle it
          db.User.find({ where: {email: profile._json.email} }).success(function(user){
            if (user){
              // user found by email, add facebookid
              user.updateAttributes({facebookid: profile.id}).success(function(user){
                return done(null, user);
              }).error(function(error){
                return done(error);
              });
            } else {
              // user not found, create user
              db.User.create({
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                email: profile._json.email,
                facebookid: profile.id
              }).success(function(user){
                return done(null, user);
              }).error(function(error){
                return done(error);
              });
            }
          }).error(function(error){
            return done(error);
          });
        }
      }).error(function(error){
        return done(error);
      });
    });
  }
));
*/

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}

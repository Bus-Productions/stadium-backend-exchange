var passport = require('passport')
  , passwordHash = require('password-hash')
  , BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  function(username, password, done) {
    process.nextTick(function () {
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
    });
  }
));


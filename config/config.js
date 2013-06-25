var env = process.env.GAME_ENV || "development";

console.log("Using the "+ env + " environment");

exports.config = function(){
  if (env == "development"){
    return {
      env: 'development',
      dbname: 'stadium_exchange',
      dbuser: 'stadium_exchange',
      dbpass: 'game2013',
      dbhost: 'localhost',
      dbport: 5432,
      host: 'localhost',
      port: 420,
      method: 'POST'
    };
  } else if (env == "staging"){
    return {
      env: 'staging',
      dbname: 'stadium_exchange',
      dbuser: 'stadium_exchange',
      dbpass: 'game2013',
      dbhost: 'poop.compute-1.amazonaws.com',
      dbport: 5432,
      host: 'blah.elasticbeanstalk.com',
      port: process.env.PORT,
      method: 'POST'
    };
  } else if (env == "production"){
    return {
      env: 'production',
      dbname: 'stadium_exchange',
      dbuser: 'stadium_exchange',
      dbpass: 'game2013',
      dbhost: 'db.something.com',
      dbport: 5432,
      host: 'some.com',
      port: process.env.PORT,
      method: 'POST'
    };
  }
}

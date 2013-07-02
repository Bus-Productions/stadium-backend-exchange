var env = process.env.NODE_ENV || "development";

console.log("Using the "+ env + " environment");

exports.config = function(){
  if (env == "development"){
    return {
      env: 'development',
      logging: true,
      dbname: 'stadium_exchange',
      dbuser: 'stadium_exchange',
      dbpass: 'game2013',
      dbhost: 'localhost',
      dbport: 5432,
      host: 'localhost',
      port: 4200,
      method: 'POST'
    };
  } else if (env == "test"){
    return {
      env: 'test',
      logging: false,
      dbname: 'stadium_exchange_test',
      dbuser: 'stadium_exchange',
      dbpass: 'game2013',
      dbhost: 'localhost',
      dbport: 5432,
      host: 'localhost',
      port: 3000,
      method: 'POST'
    };
  } else if (env == "staging"){
    return {
      env: 'staging',
      logging: true,
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
      logging: true,
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

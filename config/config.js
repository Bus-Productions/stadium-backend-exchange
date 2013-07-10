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
    var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    return {
      env: 'staging',
      logging: true,
      dbname: match[5],
      dbuser: match[1],
      dbpass: match[2],
      dbhost: match[3],
      dbport: match[4],
      host: 'localhost',
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

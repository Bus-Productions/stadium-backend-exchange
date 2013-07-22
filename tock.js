var tick = require('./lib/tick'),
    config = require('./config/config');

var timer = setInterval(function(){
  tick.execute(tick.muckMarket);
  console.log("TICK");
}, config.tick_speed);

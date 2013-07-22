var tick = require('./lib/tick'),
    config = require('./config/config').config();

var timer = setInterval(function(){
  tick.execute(tick.muckMarket);
  console.log("TICK, next tick in "+config.tick_speed);
}, config.tick_speed);

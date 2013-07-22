var tick = require('./lib/tick'),
    config = require('./config/config');

var timer = setInterval(function(){
  tick.execute(tick.muckMarket);
}, config.tick_speed);

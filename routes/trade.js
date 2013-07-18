/**
 * trade.js
 *
 * Support the routers for trades.
 */

exports.get_trades = function(req, res){
  if (req.params.trade){
    GAME.db.Trade.findAll({where: {symbol: req.params.trade}}).success(function(trade){
      if (trade && trade.values){
        res.send(200, trade.values);
      } else {
        res.send(404);
      }
    }).error(function(err){
      res.send(400, "Invalid Symbol: "+req.query.symbol+"::"+err);
    });
  } else {
    res.send(400);
  }
}

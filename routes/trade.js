/**
 * trade.js
 *
 * Support the routers for trades.
 */

exports.get_trades = function(req, res){
  if (req.params.trade){
    GAME.db.Trade.findAll({where: {symbol: req.params.trade}}).success(function(trades){
      if (trades){
        var trade_response = [];
        for (var i=0;i<trades.length;i++){
          trade_response.push(trades[i].values);
        }
        res.send(200, trade_response);
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

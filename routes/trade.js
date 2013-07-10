/**
 * trade.js
 *
 * Support the routers for trades.
 */

exports.get_trades = function(req, res){
  if (req.query.symbol){
    GAME.db.Bid.find({where: {id: req.params.order_id}}).success(function(bid){
      if (bid && bid.values){
        res.send(200, bid.values);
      } else {
        res.send(404);
      }
    }).error(function(err){
      res.send(400, "Invalid Resource ID: "+err);
    });
  } else {
    res.send(400);
  }
}

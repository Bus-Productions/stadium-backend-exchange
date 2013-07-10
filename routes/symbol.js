/**
 * symbol.js
 *
 * Support the routers for symbols.
 */

exports.get_symbol = function(req, res){
  if (req.params.symbol){
    GAME.db.Symbol.find({where: {symbol: req.params.symbol}}).success(function(symbol){
      if (symbol && symbol.values){
        res.send(200, symbol.values);
      } else {
        res.send(404);
      }
    }).error(function(err){
      res.send(400, "Invalid Symbol: "+req.params.symbol+"::"+err);
    });
  } else {
    res.send(400);
  }
}

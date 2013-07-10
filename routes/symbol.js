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

exports.create_symbol = function(req, res){
  var p = req.body;

  if (p.symbol && p.price && p.issued){
    GAME.db.Symbol.create({
      symbol: p.symbol,
      price: p.price,
      issued: p.issued
    }).success(function(symbol){
      res.send(201, symbol.values);
    });
  } else {
    var emessage = 'You did not send the following parameters: ';
    if (!p.symbol) emessage += 'symbol ';
    if (!p.price) emessage += 'price ';
    if (!p.issued) emessage += 'issued ';
    res.send(400, emessage);
  }
}

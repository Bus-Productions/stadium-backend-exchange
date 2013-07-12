/**
 * ask.js
 *
 * Support the routers for asks.
 */

exports.create_ask = function(req, res){
  var p = req.body;

  if (p.symbol && p.price && p.quantity && p.seller){
    var pa = p.price_affecting || true;
    GAME.db.Ask.create({
      symbol: p.symbol,
      price_ordered: p.price,
      price_actual: p.price,
      price_affecting: pa,
      quantity: p.quantity,
      seller: p.seller
    }).success(function(ask){
      res.send(201, ask.values);
    });
  } else {
    var emessage = 'You did not send the following parameters: ';
    if (!p.symbol) emessage += 'symbol ';
    if (!p.price) emessage += 'price ';
    if (!p.quantity) emessage += 'quantity ';
    if (!p.seller) emessage += 'seller';
    res.send(400, emessage);
  }
}

exports.ask_status = function(req, res){
  if (req.params.order_id){
    GAME.db.Ask.find({where: {id: req.params.order_id}}).success(function(ask){
      if (ask && ask.values){
        res.send(200, ask.values);
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

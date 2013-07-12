/**
 * bid.js
 *
 * Support the routers for bids.
 */

exports.create_bid = function(req, res){
  var p = req.body;

  if (p.symbol && p.price && p.quantity && p.buyer){
    var pa = p.price_affecting || true;
    GAME.db.Bid.create({
      symbol: p.symbol,
      price_ordered: p.price,
      price_actual: p.price,
      price_affecting: pa,
      quantity: p.quantity,
      buyer: p.buyer
    }).success(function(bid){
      res.send(201, bid.values);
    });
  } else {
    var emessage = 'You did not send the following parameters: ';
    if (!p.symbol) emessage += 'symbol ';
    if (!p.price) emessage += 'price ';
    if (!p.quantity) emessage += 'quantity ';
    if (!p.buyer) emessage += 'buyer';
    res.send(400, emessage);
  }
}

exports.bid_status = function(req, res){
  if (req.params.order_id){
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

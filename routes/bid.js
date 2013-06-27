/**
 * bid.js
 *
 * Support the routers for bids.
 */

exports.create_bid = function(req, res){
  var p = req.body;

  if (p.symbol && p.price && p.quantity && p.buyer){
    GAME.db.Bid.create({
      symbol: p.symbol,
      price: p.price,
      quantity: p.quantity,
      buyer: p.buyer
    }).success(function(bid){
      res.send(201, bid.values);
    });
  } else {
    res.send(400);
  }
}

exports.bid_status = function(req, res){
  if (req.params.order_id){
    GAME.db.Bid.find(req.params.order_id).success(function(bid){
      res.send(bid.values);
    });
  } else {
    res.send(400);
  }
}
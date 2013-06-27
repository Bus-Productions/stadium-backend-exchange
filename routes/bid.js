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
      res.send(201, bid);
    });
  } else {
    res.send(400);
  }
}

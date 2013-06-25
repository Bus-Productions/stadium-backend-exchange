/**
 * page.js
 *
 * Support the routers for pages.
 */

// Index page
exports.index = function(req, res){
  res.render("index", { intro: "It works!" });
}

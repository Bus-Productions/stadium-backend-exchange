exports.healthcheck = function(req, res) {
  res.send(process.env);
}

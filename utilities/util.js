const isAuthenticated = function(req, res, cb) {
  if (req.isAuthenticated())
    return cb()

  res.send(401)
}

module.exports = {
  isAuthenticated
}

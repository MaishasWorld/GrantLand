const { UnauthorizedError } = require("../errors");

function requireUser(req, res, next) {
    if (!req.user) {
      res.status(401)
      next({
        message: UnauthorizedError(),
        error: "blah",
        name: "blah"
      });
    } 
    next();
}



module.exports = {
    requireUser
}
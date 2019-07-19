// file exports
module.exports = {
  checkRole
};

//Check Role MW
function checkRole(role) {
  return function(req, res, next) {
    //where is roles going to be stored?
    //access tokens are supposed to be trusted, dont need to search elsewhere
    //includes is method can call on array
    //&& operators allows you to check presence of each
    //roles normally would be on table
    if (
      req.decodedToken &&
      req.decodedToken.roles &&
      req.decodedToken.roles.includes(role)
    ) {
      next();
    } else {
      res.status(403).json({ message: "can't touch this!" });
    }
  };
}

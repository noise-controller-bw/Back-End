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
    if (req.decoded && req.decoded.roles && req.decoded.roles.includes(role)) {
      console.log("user role is:", req.decoded.roles);
      next();
    } else {
      console.log("user role is:", req.decoded.roles);
      res
        .status(403)
        .json({ message: "You're not authorized to perform this action" });
    }
  };
}

const jwt = require("jsonwebtoken");

const jwtKey =
  process.env.JWT_SECRET ||
  "this is super secret, but I have no idea how to create a better one";

// file exports
module.exports = {
  authenticate,
  generateToken
};

// implementation details
function authenticate(req, res, next) {
  const token = req.get("Authorization");

  if (token) {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ err, message: "unauthorized user" });
      }

      req.decoded = decoded;

      next();
    });
  } else {
    return res.status(401).json({
      error: "No token provided, must be set on the Authorization Header"
    });
  }
}

// Generate token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    roles: user.role
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, jwtKey, options);
}

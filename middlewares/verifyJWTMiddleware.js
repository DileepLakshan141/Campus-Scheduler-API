const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).send("Not Authorized!");
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).send("Token expired! Access Forbidden!");
    req.user_id = decoded.id;
    req.roles = decoded.roles;
    req.username = decoded.username;
    next();
  });
};

module.exports = verifyJWT;

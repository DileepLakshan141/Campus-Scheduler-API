const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      username: user.username,
      roles: user.roles,
      id: user._id,
    },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: "10m" }
  );

  return accessToken;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      username: user.username,
    },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "1d" }
  );

  return refreshToken;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};

const studentModel = require("../models/student.model");
const admintModel = require("../models/admin.model");
const facultytModel = require("../models/faculty.model");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../controllers/tokenGenerator");

const refreshTokenHandler = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) {
    return res.sendStatus(401);
  }

  const refresh_token = cookie.jwt;
  let foundUser = await studentModel.findOne({ refresh_token }).exec();

  if (!foundUser) {
    foundUser = await facultytModel.findOne({ refresh_token }).exec();
  }

  if (!foundUser) {
    foundUser = await admintModel.findOne({ refresh_token }).exec();
  }

  if (!foundUser) {
    return res.status(403).send("Your token is mismatch with the one in db!");
  }

  const roles = Object.values(foundUser.user_roles);
  const { username, _id } = foundUser;

  jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken({ username, roles, _id });
    res.json({ accessToken });
  });
};

module.exports = { refreshTokenHandler };

const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/auth.controller");
const { logoutUser } = require("../controllers/logout.controller");
const {
  refreshTokenHandler,
} = require("../controllers/refreshToken.controller");

router.get("/refresh-token", refreshTokenHandler);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

module.exports = router;

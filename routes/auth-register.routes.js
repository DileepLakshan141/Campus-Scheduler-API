const express = require("express");
const router = express.Router();
const auth_roles = require("../config/userRoles");
const verifyRoles = require("../middlewares/verifyRolesMiddleware");
const {
  createNewAdmin,
  createNewFaculty,
  createNewStudent,
} = require("../controllers/registration.controller");

const { Admin } = auth_roles;

router.post("/create-account/student", verifyRoles(Admin), createNewStudent);
router.post("/create-account/faculty", verifyRoles(Admin), createNewFaculty);
router.post("/create-account/admin", verifyRoles(Admin), createNewAdmin);

module.exports = router;

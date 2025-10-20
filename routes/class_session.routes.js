const express = require("express");
const router = express.Router();
const auth_roles = require("../config/userRoles");
const verifyRoles = require("../middlewares/verifyRolesMiddleware");
const createNewSession = require("../controllers/createClassSession.controller");
const deleteSessionUsingObjectId = require("../controllers/deleteClassSessionController");
const updateSessionUsingObjectId = require("../controllers/updateClassSession.controller");
const {
  getAllClassSessions,
  getSessionUsingObjectId,
} = require("../controllers/getClassSessions.controller");

const { Admin, Faculty } = auth_roles;

router.get("/get-all", verifyRoles(Faculty, Admin), getAllClassSessions);

router.get("/get/:id", verifyRoles(Faculty, Admin), getSessionUsingObjectId);

router.post("/create", verifyRoles(Faculty, Admin), createNewSession);

router.put(
  "/update/:id",
  verifyRoles(Faculty, Admin),
  updateSessionUsingObjectId
);

router.delete(
  "/delete/:id",
  verifyRoles(Faculty, Admin),
  deleteSessionUsingObjectId
);

module.exports = router;

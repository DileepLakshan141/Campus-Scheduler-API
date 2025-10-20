const express = require("express");
const router = express.Router();
const auth_roles = require("../config/userRoles");
const verifyRoles = require("../middlewares/verifyRolesMiddleware");
const deleteNotificationByObjectId = require("../controllers/deleteNotification.controller");
const createNotification = require("../controllers/createNotification.controller");
const {
  getAllNotifications,
  getNotificationByObjectId,
} = require("../controllers/getNotifications.controller");

const { Faculty, Student, Admin } = auth_roles;

router.get(
  "/get-all",
  verifyRoles(Student, Faculty, Admin),
  getAllNotifications
);

router.get(
  "/get/:id",
  verifyRoles(Student, Faculty, Admin),
  getNotificationByObjectId
);

router.post("/create", verifyRoles(Faculty, Admin), createNotification);

router.delete("/delete/:id", verifyRoles(Admin), deleteNotificationByObjectId);

module.exports = router;

const express = require("express");
const router = express.Router();
const createTimeTable = require("../controllers/createTimeTable.controller");
const updateTimeTable = require("../controllers/updateTimeTable.controller");
const deleteTimeTable = require("../controllers/deleteTimeTable.controller");
const auth_roles = require("../config/userRoles");
const verifyRoles = require("../middlewares/verifyRolesMiddleware");
const {
  getAllTimeTables,
  getTimeTableByObjectId,
} = require("../controllers/getTimeTables.controller");

const { Student, Admin, Faculty } = auth_roles;

router.get("/get-all", verifyRoles(Student, Faculty, Admin), getAllTimeTables);

router.get(
  "/get/:id",
  verifyRoles(Student, Faculty, Admin),
  getTimeTableByObjectId
);

router.post("/create", verifyRoles(Faculty, Admin), createTimeTable);

router.put("/update/:id", verifyRoles(Faculty, Admin), updateTimeTable);

router.delete("/delete/:id", verifyRoles(Faculty, Admin), deleteTimeTable);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth_roles = require("../config/userRoles");
const verifyRoles = require("../middlewares/verifyRolesMiddleware");
const getFacultyTimeTables = require("../controllers/getTimeTableBasedOnFaculty.controller");
const viewEnrolledCourses = require("../controllers/viewEnrolledCourses.controller");

const { Student } = auth_roles;

router.get("/time-tables", verifyRoles(Student), getFacultyTimeTables);

router.get("/enrolled-courses", verifyRoles(Student), viewEnrolledCourses);

module.exports = router;

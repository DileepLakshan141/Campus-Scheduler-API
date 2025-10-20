const express = require("express");
const router = express.Router();
const auth_roles = require("../config/userRoles");
const verifyRoles = require("../middlewares/verifyRolesMiddleware");
const makeStudentSelfEnrollment = require("../controllers/createEnrollment.controller");
const enrollStudentByStudentId = require("../controllers/enrollStudentsToCourses.controller");
const viewStudentEnrollmentsByCourse = require("../controllers/viewEnrollments.controller");
const unenrollStudentFromCourse = require("../controllers/deleteEnrollment.controller");

const { Student, Faculty, Admin } = auth_roles;

router.post(
  "/enroll-to-course/:course_id",
  verifyRoles(Student),
  makeStudentSelfEnrollment
);

router.post(
  "/enroll-student/:course_id/:student_Id",
  verifyRoles(Faculty, Admin),
  enrollStudentByStudentId
);

router.get(
  "/view-enrolled-students/:course_id",
  verifyRoles(Faculty, Admin),
  viewStudentEnrollmentsByCourse
);

router.delete(
  "/unenroll-student/:course_id/:student_Id",
  verifyRoles(Faculty, Admin),
  unenrollStudentFromCourse
);

module.exports = router;

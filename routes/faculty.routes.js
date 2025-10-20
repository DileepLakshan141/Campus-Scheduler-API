const express = require("express");
const router = express.Router();
const verifyRoles = require("../middlewares/verifyRolesMiddleware");
const {
  getOfferingCoursesByFaculties,
  getOfferingCoursesByFacultiesUsingObjectId,
} = require("../controllers/getOfferingCourses");
const auth_roles = require("../config/userRoles");

const { Student, Admin, Faculty } = auth_roles;

router.get(
  "/get-offering-courses/:id",
  verifyRoles(Student, Faculty, Admin),
  getOfferingCoursesByFacultiesUsingObjectId
);

router.post(
  "/get-offering-courses",
  verifyRoles(Admin),
  getOfferingCoursesByFaculties
);

module.exports = router;

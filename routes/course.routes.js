const express = require("express");
const router = express.Router();
const verifyRoles = require("../middlewares/verifyRolesMiddleware");
const auth_roles = require("../config/userRoles");
const { assignFaculty } = require("../controllers/assignFaculties.controller");
const {
  getOfferingFacultiesForCourse,
} = require("../controllers/getOfferingFaculties");
const {
  unassignFaculty,
} = require("../controllers/unassignFaculties.controller");
const {
  createNewCourse,
  getAllCourses,
  updateCourseUsingObjectID,
  deleteCourseUsingObjectId,
  getCourseUsingObjectId,
} = require("../controllers/course.controller");

const { Student, Faculty, Admin } = auth_roles;

router.get(
  "/get-all-courses",
  verifyRoles(Student, Admin, Faculty),
  getAllCourses
);

router.get(
  "/get-course/:id",
  verifyRoles(Student, Faculty, Admin),
  getCourseUsingObjectId
);

router.post("/create-course", verifyRoles(Admin), createNewCourse);

router.post("/assign-faculty", verifyRoles(Admin), assignFaculty);

router.get(
  "/offering-faculties/:course_id",
  verifyRoles(Admin),
  getOfferingFacultiesForCourse
);

router.post("/unassign-faculty", verifyRoles(Admin), unassignFaculty);

router.put("/update-course/:id", verifyRoles(Admin), updateCourseUsingObjectID);

router.delete(
  "/delete-course/:id",
  verifyRoles(Admin),
  deleteCourseUsingObjectId
);

module.exports = router;

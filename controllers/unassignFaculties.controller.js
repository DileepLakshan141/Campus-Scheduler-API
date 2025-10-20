const courseModel = require("../models/course.model");
const facultyModel = require("../models/faculty.model");

const unassignFaculty = async (req, res) => {
  const { course_code, faculty_id } = req.body;

  // validate entered course code
  const courseCodeFormat = /^(IT|SE|HS|BM|ENG)\d{4}$/;
  const validateCourseCode = (code) => {
    return courseCodeFormat.test(code);
  };

  if (!validateCourseCode(course_code)) {
    return res.status(400).json({
      error: "not a valid course code!",
      cause: "course code is not in correct format!",
    });
  }

  // validate entered faculty id
  const facultyIdFormat = /^FAC\d{4}$/;
  const facultyIdValidator = (facId) => {
    return facultyIdFormat.test(facId);
  };

  if (!facultyIdValidator(faculty_id)) {
    return res
      .status(400)
      .json({
        error: "not a valid faculty id",
        cause: "faculty id is not in correct format!",
      });
  }

  if (!course_code || !faculty_id) {
    return res.status(400).json({
      error: "please provide required fields (course_code, faculty_id)",
    });
  }

  // check there is course with passed course_code
  const foundCourse = await courseModel.findOne({ code: course_code }).exec();

  if (!foundCourse) {
    return res
      .status(404)
      .json({ error: "not a valid course id! course does not exist!" });
  }

  // check there is a faculty with passed faculty name
  const foundFaculty = await facultyModel.findOne({ faculty_id }).exec();

  if (!foundFaculty) {
    return res
      .status(404)
      .json({ error: "not a valid faculty id! faculty does not exist!" });
  }

  //check if faculty is already assigned to that course
  const alreadyAssigned = foundCourse.offered_faculties.includes(
    foundFaculty._id
  );

  // if faculty is not in the list return error
  if (!alreadyAssigned) {
    return res.status(400).json({
      error: "action can not be done! this faculty does not offer this course!",
    });
  }

  const facultyObjIdString = foundFaculty._id.toString();
  const latestOfferingFaculties = foundCourse.offered_faculties.filter((id) => {
    return id.toString() !== facultyObjIdString;
  });

  console.log(latestOfferingFaculties);

  foundCourse.offered_faculties = latestOfferingFaculties;
  const result = await foundCourse.save();

  res.status(200).json({
    ...result._doc,
    message: "faculty unassigned from the course successfully!",
  });
};

module.exports = { unassignFaculty };

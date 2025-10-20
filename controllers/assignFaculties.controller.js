const courseModel = require("../models/course.model");
const facultyModel = require("../models/faculty.model");

const assignFaculty = async (req, res) => {
  const { course_code, faculty_id } = req.body;

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
  const alreadyAssigned = foundCourse.offered_faculties.some((faculty) =>
    faculty.equals(foundFaculty._id)
  );

  if (alreadyAssigned) {
    return res
      .status(400)
      .json({ error: "faculty is already assigned to the course!" });
  }

  // else assign the faculty to that course
  foundCourse.offered_faculties.push(foundFaculty._id);
  const result = foundCourse.save();
  res.status(200).json({
    ...result._doc,
    message: "faculty assigned to the course successfully!",
  });
};

module.exports = { assignFaculty };

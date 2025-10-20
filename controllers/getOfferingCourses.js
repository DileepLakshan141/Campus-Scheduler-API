const courseModel = require("../models/course.model");
const facultyModel = require("../models/faculty.model");

const getOfferingCoursesByFaculties = async (req, res) => {
  const { faculty_id } = req.body;

  if (!faculty_id) {
    return res.status(400).json({
      error: "please provide required fields (faculty_id)",
    });
  }

  // validate entered faculty id
  const facultyIdFormat = /^FAC\d{4}$/;
  const facultyIdValidator = (facId) => {
    return facultyIdFormat.test(facId);
  };

  if (!facultyIdValidator(faculty_id)) {
    return res.status(400).json({
      error: "not a valid faculty id",
      cause: "faculty id is not in correct format!",
    });
  }

  // check there is a faculty with passed faculty id
  const foundFaculty = await facultyModel.findOne({ faculty_id }).exec();

  if (!foundFaculty) {
    return res
      .status(404)
      .json({ error: "not a valid faculty id! faculty does not exist!" });
  }

  // get all courses
  const availableCourses = await courseModel.find({});

  const offeringCourses = [];

  await Promise.all(
    availableCourses.map(
      async (courseObj) =>
        await Promise.all(
          courseObj.offered_faculties.map(async (fac_id) => {
            if (fac_id.toString() === foundFaculty._id.toString()) {
              const course = await courseModel
                .findById(courseObj._id)
                .select("-_id -offered_faculties -createdAt -updatedAt -__v")
                .exec();
              offeringCourses.push(course);
            }
          })
        )
    )
  );

  if (offeringCourses.length < 1) {
    return res.status(200).json({
      message: "currently this faculty not offer any course!",
    });
  }

  res.status(200).json(offeringCourses);
};

const getOfferingCoursesByFacultiesUsingObjectId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: "please send a faculty id with paramaters",
    });
  }

  try {
    // check there is a faculty with passed faculty id
    const foundFaculty = await facultyModel.findById(id);

    if (!foundFaculty) {
      return res
        .status(404)
        .json({ error: "not a valid faculty id! faculty does not exist!" });
    }

    // get all courses
    const availableCourses = await courseModel.find({});

    const offeringCourses = [];

    await Promise.all(
      availableCourses.map(
        async (courseObj) =>
          await Promise.all(
            courseObj.offered_faculties.map(async (fac_id) => {
              if (fac_id.toString() === foundFaculty._id.toString()) {
                const course = await courseModel
                  .findById(courseObj._id)
                  .select("-_id -offered_faculties -createdAt -updatedAt -__v")
                  .exec();
                offeringCourses.push(course);
              }
            })
          )
      )
    );

    if (offeringCourses.length < 1) {
      return res.status(200).json({
        message: "currently this faculty not offer any course!",
      });
    }

    res.status(200).json(offeringCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error!" });
  }
};

module.exports = {
  getOfferingCoursesByFaculties,
  getOfferingCoursesByFacultiesUsingObjectId,
};

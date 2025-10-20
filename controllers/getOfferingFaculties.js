const courseModel = require("../models/course.model");

const getOfferingFacultiesForCourse = async (req, res) => {
  const { course_id } = req.params;

  if (!course_id) {
    return res.status(400).json({
      error: "please provide required fields (course_id)",
    });
  }

  // check there is course with passed course_code
  const foundCourse = await courseModel
    .findById(course_id)
    .select("-_id -createdAt -updatedAt -__v -description -credits")
    .populate({
      path: "offered_faculties",
      select: "-user_roles -_id -password -refresh_token -createdAt -updatedAt",
    })
    .exec();

  if (!foundCourse) {
    return res
      .status(404)
      .json({ error: "not a valid course id! course does not exist!" });
  }

  res.status(200).json(foundCourse);
};

module.exports = { getOfferingFacultiesForCourse };

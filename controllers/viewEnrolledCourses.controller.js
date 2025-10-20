const enrollmentModel = require("../models/enrollment.model");
const studentModel = require("../models/student.model");

const viewEnrolledCourses = async (req, res) => {
  if (!req.user_id) {
    return res
      .status(400)
      .json({ error: "can not detect the logged user id!" });
  }

  //find the student who belong the id
  const foundStudent = await studentModel.findById(req.user_id).exec();

  // if not return error
  if (!foundStudent) {
    return res.status(400).json({
      error: "can not find the account details of logged student!",
      cause: "only student account holder can use this feature",
    });
  }

  //get all the courses particular student is enrolled
  const enrolledCourses = await enrollmentModel
    .find({ studentId: foundStudent._id })
    .select("-createdAt -updatedAt -__v")
    .populate({
      path: "studentId",
      select:
        "-_id -createdAt -updatedAt -refresh_token -password -__v -nic -user_roles -email -faculty",
    })
    .populate({
      path: "facultyId",
      select:
        "-_id -createdAt -updatedAt -__v -refresh_token -password -email -user_roles",
    })
    .populate({
      path: "courseId",
      select: "-_id -createdAt -updatedAt -__v -offered_faculties -description",
    })
    .exec();

  if (enrolledCourses) {
    if (enrolledCourses.length < 1) {
      return res
        .status(200)
        .json({ message: "you have not enrolled to any course yet!" });
    } else {
      return res.status(200).json(enrolledCourses);
    }
  } else {
    return res
      .status(400)
      .json({ error: "can not get the enrolled course list" });
  }
};

module.exports = viewEnrolledCourses;

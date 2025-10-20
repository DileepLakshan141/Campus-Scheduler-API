const courseModel = require("../models/course.model");
const enrollmentModel = require("../models/enrollment.model");

const viewStudentEnrollmentsByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    if (!course_id) {
      return res.status(400).json({
        error: "valid course id is required to proceed!",
      });
    }

    // check is there a course with course code
    const foundCourse = await courseModel.findById(course_id).exec();

    if (!foundCourse) {
      return res
        .status(400)
        .json({ error: "can not find a course with entered course id!" });
    }

    const enrolledStudentsList = await enrollmentModel
      .find({
        courseId: foundCourse._id,
      })
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
        select:
          "-_id -createdAt -updatedAt -__v -offered_faculties -description",
      })
      .exec();

    if (enrolledStudentsList) {
      if (enrolledStudentsList.length < 1) {
        return res.status(200).json({
          message: "currently no students enrolled into this course!",
        });
      } else {
        return res.status(200).json(enrolledStudentsList);
      }
    } else {
      return res.status(400).json({
        error: `can not get the enrolled student list for course ${foundCourse.code}`,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
};

module.exports = viewStudentEnrollmentsByCourse;

const courseModel = require("../models/course.model");
const enrollmentModel = require("../models/enrollment.model");
const studentModel = require("../models/student.model");

const makeSelfEnrollment = async (req, res) => {
  if (!req.user_id) {
    return res
      .status(400)
      .json({ error: "can not detect the logged user id!" });
  }

  try {
    //find the student who belong the id
    const foundStudent = await studentModel.findById(req.user_id).exec();

    // if not return error
    if (!foundStudent) {
      return res.status(400).json({
        error: "can not find the account details of logged student!",
        cause: "only student account holder can use this feature",
      });
    }

    const { course_id } = req.params;

    if (!course_id) {
      return res
        .status(400)
        .json({ error: "valid course id is required to proceed!" });
    }

    // check is there a course with course code
    const foundCourse = await courseModel.findById(course_id).exec();

    if (!foundCourse) {
      return res
        .status(400)
        .json({ error: "can not find a course with entered course id!" });
    }

    //check student's faculty offer requesting course
    if (foundCourse.offered_faculties.includes(foundStudent.faculty)) {
      //check for duplicateEnrollment
      const duplicateEnrollment = await enrollmentModel
        .findOne({
          studentId: foundStudent._id,
          facultyId: foundStudent.faculty,
          courseId: foundCourse._id,
        })
        .exec();

      if (duplicateEnrollment) {
        return res.status(400).json({
          error: "duplicate enrollment found!",
          cause: "you are already enrolled to this course!",
        });
      }

      const newEnrollment = await enrollmentModel.create({
        studentId: foundStudent._id,
        facultyId: foundStudent.faculty,
        courseId: foundCourse._id,
      });

      if (newEnrollment) {
        return res.status(201).json({
          message: `you(Student ID: ${foundStudent.studentId}) enrolled to the course ${foundCourse.code} successfully!`,
        });
      } else {
        return res.status(400).json({
          error: `can not be enrolled to the course ${foundCourse.code}`,
        });
      }
    } else {
      return res.status(400).json({
        error: "enrollment not allowed!",
        cause: "your faculty does not offer this course.",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
};

module.exports = makeSelfEnrollment;

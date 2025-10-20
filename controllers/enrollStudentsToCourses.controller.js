const courseModel = require("../models/course.model");
const enrollmentModel = require("../models/enrollment.model");
const studentModel = require("../models/student.model");

const enrollStudentByStudentId = async (req, res) => {
  try {
    const { course_id, student_Id } = req.params;

    if (!course_id || !student_Id) {
      return res.status(400).json({
        error: "valid course id and student id is required to proceed!",
      });
    }

    // check is there a student with provided studentId
    const foundStudent = await studentModel.findById(student_Id).exec();

    // if not return error
    if (!foundStudent) {
      return res.status(400).json({
        error: "can not find the account details of the student!",
        cause: "invalid studentId entered!",
      });
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
          cause: "student is already enrolled to this course!",
        });
      }

      const newEnrollment = await enrollmentModel.create({
        studentId: foundStudent._id,
        facultyId: foundStudent.faculty,
        courseId: foundCourse._id,
      });

      if (newEnrollment) {
        return res.status(201).json({
          message: `StudentId: ${foundStudent.studentId} enrolled to the course ${foundCourse.code} successfully!`,
        });
      } else {
        return res.status(400).json({
          error: `can not be enrolled to the course ${foundCourse.code}! error occured!`,
        });
      }
    } else {
      return res.status(400).json({
        error: "can not enroll this student to this course!",
        cause: "student's faculty does not offer this course. invalid action",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
};

module.exports = enrollStudentByStudentId;

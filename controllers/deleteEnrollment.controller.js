const courseModel = require("../models/course.model");
const enrollmentModel = require("../models/enrollment.model");
const studentModel = require("../models/student.model");
const facultyModel = require("../models/faculty.model");
const adminModel = require("../models/admin.model");

const unenrollStudentByStudentId = async (req, res) => {
  if (!req.user_id) {
    return res
      .status(400)
      .json({ error: "can not detect the logged user id!" });
  }

  let foundUser;
  let foundUserRole;

  // check logged in account belong to a faculty role
  foundUser = await facultyModel.findById(req.user_id).exec();

  if (foundUser?.faculty_id) {
    foundUserRole = "Faculty";
  }

  // if not, check whether it is belong to an admin role
  if (!foundUser) {
    foundUser = await adminModel.findById(req.user_id).exec();
  }

  if (foundUser?.admin_id) {
    foundUserRole = "Admin";
  }

  // if not return error
  if (!foundUser || !foundUserRole) {
    return res
      .status(400)
      .json({ error: "can not find the account details of logged in user!" });
  }

  const { course_id, student_Id } = req.params;

  if (!course_id || !student_Id) {
    return res.status(400).json({
      error: "valid course id and student id is required to proceed!",
      cause: "course code and studentId is not in request body",
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
    return res.status(400).json({
      error: "can not find a course with entered course id!",
      cause: "invalid or non existing course id!",
    });
  }

  //check student is enrolled into the specific course
  const foundEnrollment = await enrollmentModel.findOne({
    studentId: foundStudent._id,
    courseId: foundCourse._id,
  });

  if (!foundEnrollment) {
    return res.status(400).json({
      error: "student can not be unenrolled from the course!",
      cause: "target student is not enrolled to this course yet.",
    });
  }

  // we want to restrict the permissions to unenroll the students who are only belong
  // to the logged in user's faculty when logged in role is faculty. if role is admin we give permission unenrol
  // students regardless their faculty

  // function to delete the enrollment link
  const deleteTheEnrollmentLink = async () => {
    const deletedEnrollment = await enrollmentModel.findByIdAndDelete(
      foundEnrollment._id
    );
    if (deletedEnrollment) {
      return res.status(200).json({
        message: `student ${foundStudent.studentId} unenrolled from the course ${foundCourse.code}`,
      });
    } else {
      return res
        .status(400)
        .json({ error: "can not unenrol the student from the course!" });
    }
  };

  if (foundUserRole === "Faculty") {
    if (foundUser._id.toString() === foundStudent.faculty.toString()) {
      await deleteTheEnrollmentLink();
    } else {
      return res.status(400).json({
        error: "can not unenroll the target student from that course!",
        cause:
          "target student is not belong to your faculty! scope restrictions",
      });
    }
  } else {
    await deleteTheEnrollmentLink();
  }
};

module.exports = unenrollStudentByStudentId;

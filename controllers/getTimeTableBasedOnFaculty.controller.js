const timeTableModel = require("../models/time_table.model");
const studentModel = require("../models/student.model");

const getTimeTableBasedOnStudentsFaculty = async (req, res) => {
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

  // find time tables belong to the student's faculty
  const timeTables = await timeTableModel
    .find({ faculty: foundStudent.faculty })
    .populate({
      path: "faculty",
      select:
        "-user_roles -email -password -refresh_token -createdAt -updatedAt -_id -__v",
    })
    .populate({
      path: "monday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: {
        path: "course",
        select:
          "-_id -description -offered_faculties -createdAt -updatedAt -__v",
      },
    })
    .populate({
      path: "tuesday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: {
        path: "course",
        select:
          "-_id -description -offered_faculties -createdAt -updatedAt -__v",
      },
    })
    .populate({
      path: "wednesday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: {
        path: "course",
        select:
          "-_id -description -offered_faculties -createdAt -updatedAt -__v",
      },
    })
    .populate({
      path: "thursday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: {
        path: "course",
        select:
          "-_id -description -offered_faculties -createdAt -updatedAt -__v",
      },
    })
    .populate({
      path: "friday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: {
        path: "course",
        select:
          "-_id -description -offered_faculties -createdAt -updatedAt -__v",
      },
    })
    .exec();

  if (timeTables) {
    if (timeTables.length < 1) {
      return res
        .status(200)
        .json({ message: "currently no timetables belong to your faculty!" });
    }
    return res.status(200).json(timeTables);
  }
};

module.exports = getTimeTableBasedOnStudentsFaculty;

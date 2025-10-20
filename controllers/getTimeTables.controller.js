const timeTableModel = require("../models/time_table.model");
const facultyModel = require("../models/faculty.model");
const time_tableModel = require("../models/time_table.model");

const getAllTimeTables = async (req, res) => {
  const timeTables = await timeTableModel
    .find({})
    .populate({
      path: "faculty",
      select:
        "-user_roles -email -password -refresh_token -createdAt -updatedAt -_id -__v",
    })
    .populate({
      path: "monday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: [
        {
          path: "course",
          select:
            "-_id -description -offered_faculties -createdAt -updatedAt -__v",
        },
        {
          path: "location",
          select: "-_id -__v -createdAt -updatedAt -availability -bookedBy",
        },
      ],
    })
    .populate({
      path: "tuesday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: [
        {
          path: "course",
          select:
            "-_id -description -offered_faculties -createdAt -updatedAt -__v",
        },
        {
          path: "location",
          select: "-_id -__v -createdAt -updatedAt -availability -bookedBy",
        },
      ],
    })
    .populate({
      path: "wednesday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: [
        {
          path: "course",
          select:
            "-_id -description -offered_faculties -createdAt -updatedAt -__v",
        },
        {
          path: "location",
          select: "-_id -__v -createdAt -updatedAt -availability -bookedBy",
        },
      ],
    })
    .populate({
      path: "thursday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: [
        {
          path: "course",
          select:
            "-_id -description -offered_faculties -createdAt -updatedAt -__v",
        },
        {
          path: "location",
          select: "-_id -__v -createdAt -updatedAt -availability -bookedBy",
        },
      ],
    })
    .populate({
      path: "friday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: [
        {
          path: "course",
          select:
            "-_id -description -offered_faculties -createdAt -updatedAt -__v",
        },
        {
          path: "location",
          select: "-_id -__v -createdAt -updatedAt -availability -bookedBy",
        },
      ],
    })
    .exec();

  if (timeTables) {
    if (timeTables.length < 1) {
      return res
        .status(200)
        .json({ message: "currently no timetable to display!" });
    }
    return res.status(200).json(timeTables);
  }
};

const getTimeTableByObjectId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: "timetable id is required! try again with valid id!" });
  }

  const foundTimeTable = await timeTableModel
    .findById(id)
    .populate({
      path: "faculty",
      select:
        "-user_roles -email -password -refresh_token -createdAt -updatedAt -_id -__v",
    })
    .populate({
      path: "monday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: [
        {
          path: "course",
          select:
            "-_id -description -offered_faculties -createdAt -updatedAt -__v",
        },
        {
          path: "location",
          select: "-_id -__v -createdAt -updatedAt -availability -bookedBy",
        },
      ],
    })
    .populate({
      path: "tuesday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: [
        {
          path: "course",
          select:
            "-_id -description -offered_faculties -createdAt -updatedAt -__v",
        },
        {
          path: "location",
          select: "-_id -__v -createdAt -updatedAt -availability -bookedBy",
        },
      ],
    })
    .populate({
      path: "wednesday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: [
        {
          path: "course",
          select:
            "-_id -description -offered_faculties -createdAt -updatedAt -__v",
        },
        {
          path: "location",
          select: "-_id -__v -createdAt -updatedAt -availability -bookedBy",
        },
      ],
    })
    .populate({
      path: "thursday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: [
        {
          path: "course",
          select:
            "-_id -description -offered_faculties -createdAt -updatedAt -__v",
        },
        {
          path: "location",
          select: "-_id -__v -createdAt -updatedAt -availability -bookedBy",
        },
      ],
    })
    .populate({
      path: "friday_sessions",
      select: "-createdAt -updatedAt -_id -faculty -__v",
      populate: [
        {
          path: "course",
          select:
            "-_id -description -offered_faculties -createdAt -updatedAt -__v",
        },
        {
          path: "location",
          select: "-_id -__v -createdAt -updatedAt -availability -bookedBy",
        },
      ],
    })
    .exec();

  if (foundTimeTable) {
    return res.status(200).json(foundTimeTable);
  } else {
    return res
      .status(404)
      .json({ error: "no timetable that match with entered id!" });
  }
};

module.exports = {
  getAllTimeTables,
  getTimeTableByObjectId,
};

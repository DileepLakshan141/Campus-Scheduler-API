const timeTableModel = require("../models/time_table.model");
const notificationModel = require("../models/notification.model");

const deleteTimeTableUsingObjectId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: "timetable id is required! try again with valid id!" });
  }

  try {
    const foundTimeTable = await timeTableModel
      .findById(id)
      .populate({
        path: "faculty",
      })
      .exec();

    if (foundTimeTable) {
      const deleteTimeTable = await timeTableModel.findByIdAndDelete(
        foundTimeTable._id
      );

      if (deleteTimeTable) {
        const dispatchNotification = await notificationModel.create({
          type: `${foundTimeTable.faculty.username} ${foundTimeTable.academic_year} Timetable Removed!`,
          message: `Timetable of ${foundTimeTable.faculty.username} for academic year ${foundTimeTable.academic_year} has been removed!. New timetable will be published shortly!.`,
          createdBy: "Timetable and Session Management System.",
        });

        dispatchNotification
          ? console.log("notification dispatched successfully!")
          : console.log("notification dispatch failed!");

        return res.status(200).json({
          message: `timetable with id ${foundTimeTable._id} deleted successfully!`,
        });
      } else {
        return res
          .status(500)
          .json({ message: `server error! timetable can not be deleted!` });
      }
    } else {
      return res.status(404).json({ error: "timetable does not exist!" });
    }
  } catch (error) {
    return res.status(500).json({
      error: "internal server error!",
      possibleReason: "invalid object id passed",
    });
  }
};

module.exports = deleteTimeTableUsingObjectId;

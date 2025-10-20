const classSessionModel = require("../models/class_session.model");
const notificationModel = require("../models/notification.model");

// delete a session using session object id
const deleteSessionUsingObjectId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: "please provide a session object id!" });
  }

  try {
    //check if session is existing
    const foundSession = await classSessionModel.findById(id);

    if (foundSession) {
      const deletedSession = await classSessionModel.findByIdAndDelete(id);

      if (deletedSession) {
        const dispatchNotification = await notificationModel.create({
          type: `${foundSession.session_id} session has been removed!`,
          message: `${foundSession.session_id} (${foundSession.session_category}) session will no longer be delivered! check your time tables to see the changes. new session will be added for replace this shortly.`,
          createdBy: `Timetable & Class Sessions Management System`,
        });

        dispatchNotification
          ? console.log("notification dispatched!")
          : console.log("notification could not be send! an error occured!");

        res.status(200).json({
          message: `class session with id ${foundSession.session_id} deleted successfully!`,
        });
      } else {
        res.status(200).json({
          message: `can not delete the class session with id ${foundSession.session_id}. unsuccessful!`,
        });
      }
    } else {
      res.status(200).json({
        message: `can not find the class session with id ${id}. action unsuccessful!`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error!" });
  }
};

module.exports = deleteSessionUsingObjectId;

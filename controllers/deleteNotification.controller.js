const notificationModel = require("../models/notification.model");

const deleteNotificationByObjectId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ error: "valid notification object id is required!" });
    }
    const foundNotification = await notificationModel.findById(id);
    if (foundNotification) {
      const deletedNotification = await notificationModel.findByIdAndDelete(
        foundNotification._id
      );
      if (deletedNotification) {
        return res
          .status(200)
          .json({ message: "notification deleted successfully!" });
      } else {
        return res
          .status(400)
          .json({ error: "notification could not be deleted!" });
      }
    } else {
      return res
        .status(400)
        .json({ error: "can not get the notification availability!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error occured!" });
  }
};

module.exports = deleteNotificationByObjectId;

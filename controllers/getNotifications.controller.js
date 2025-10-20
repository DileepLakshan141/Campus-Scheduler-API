const notificationModel = require("../models/notification.model");

const getAllNotifications = async (req, res) => {
  try {
    const availableNotifications = await notificationModel.find({}).exec();
    if (availableNotifications) {
      if (availableNotifications.length < 1) {
        return res
          .status(200)
          .json({ message: "currently not published notifications!" });
      } else {
        return res.status(200).json(availableNotifications);
      }
    } else {
      return res
        .status(400)
        .json({ error: "can not get the notifications! server error!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error occured!" });
  }
};

const getNotificationByObjectId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ error: "valid notification object id is required!" });
    }
    const notification = await notificationModel.findById(id);
    if (notification) {
      return res.status(200).json(notification);
    } else {
      return res
        .status(400)
        .json({ error: "can not get the notification details!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error occured!" });
  }
};

module.exports = { getAllNotifications, getNotificationByObjectId };

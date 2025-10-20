const notificationModel = require("../models/notification.model");
const facultyModel = require("../models/faculty.model");
const adminModel = require("../models/admin.model");

const createNotification = async (req, res) => {
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

  const { type, message } = req.body;

  if (!type || !message) {
    return res
      .status(400)
      .json({ error: "can not find the message type or message body!" });
  }

  try {
    const createdMessage = await notificationModel.create({
      type,
      message,
      createdBy: foundUserRole === "Faculty" ? foundUser.username : "Admin",
    });

    if (createdMessage) {
      return res.status(201).json(createdMessage);
    } else {
      return res
        .status(400)
        .json({ message: "announcement can not be published!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error occured!" });
  }
};

module.exports = createNotification;

const classSessionModel = require("../models/class_session.model");

// get all class sessions
const getAllClassSessions = async (req, res) => {
  const classSessions = await classSessionModel
    .find({})
    .populate({
      path: "course",
      select:
        "-createdAt -updatedAt -_id -__v -description -credits -offered_faculties",
    })
    .populate({
      path: "faculty",
      select:
        "-createdAt -updatedAt -_id -__v -user_roles -password -refresh_token",
    })
    .populate({
      path: "location",
      select: "-createdAt -updatedAt -_id -__v -availability -bookedBy",
    })
    .exec();

  if (classSessions) {
    if (classSessions.length < 1) {
      return res.status(200).json({ message: "no available ckass" });
    }
    return res.status(200).json(classSessions);
  } else {
    return res
      .status(400)
      .json({ error: "can not fetch the class sessions! unsuccessful!" });
  }
};

// get a session using session id
const getSessionUsingObjectId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: "please provide a session object id!" });
  }

  try {
    const foundSession = await classSessionModel
      .findById(id)
      .populate({
        path: "course",
        select:
          "-createdAt -updatedAt -_id -__v -description -credits -offered_faculties",
      })
      .populate({
        path: "faculty",
        select:
          "-createdAt -updatedAt -_id -__v -user_roles -password -refresh_token",
      })
      .populate({
        path: "location",
        select: "-createdAt -updatedAt -_id -__v -availability -bookedBy",
      })
      .exec();

    if (!foundSession) {
      return res
        .status(404)
        .json({ error: "session does not exist or invalid object id!" });
    } else {
      return res.status(200).json({ foundSession });
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server error!" });
  }
};

module.exports = {
  getAllClassSessions,
  getSessionUsingObjectId,
};

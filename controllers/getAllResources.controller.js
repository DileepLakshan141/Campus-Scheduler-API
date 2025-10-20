const resourceModel = require("../models/resource.model");

const getAllResources = async (req, res) => {
  try {
    const allResources = await resourceModel
      .find({})
      .select("-__v -_id")
      .exec();

    if (allResources) {
      if (allResources.length < 1) {
        return res
          .status(200)
          .json({ message: "currently no created resources!" });
      } else {
        return res.status(200).json(allResources);
      }
    } else {
      return res
        .status(400)
        .json({ error: "resources can not be found! action unsuccessful!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
};

module.exports = getAllResources;

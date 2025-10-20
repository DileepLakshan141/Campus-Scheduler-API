const resourceModel = require("../models/resource.model");

const getResourceByObjectId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "resource object id is required!" });
    }

    const foundResource = await resourceModel
      .findById(id)
      .select("-__v -_id")
      .exec();

    if (foundResource) {
      return res.status(200).json(foundResource);
    } else {
      return res
        .status(400)
        .json({ error: "resources can not be found! action unsuccessful!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
};

module.exports = getResourceByObjectId;

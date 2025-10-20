const resourceModel = require("../models/resource.model");

const deleteResourceByObjectId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "resource object id is required!" });
    }

    const foundResource = await resourceModel.findById(id).exec();

    if (foundResource) {
      const deletedResource = await resourceModel
        .findByIdAndDelete(foundResource._id)
        .exec();

      if (deletedResource) {
        return res.status(200).json({
          message: `resource id with ${foundResource.resource_id} deleted successfully!`,
        });
      } else {
        return res.status(400).json({
          error: `resource can not be deleted! action unsuccessful!`,
        });
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

module.exports = deleteResourceByObjectId;

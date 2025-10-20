const resourceModel = require("../models/resource.model");

const updateResourceByObjectId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "resource object id is required!" });
    }

    const { resource_type, resource_name, availability } = req.body;

    if (!resource_type || !resource_name || !availability) {
      return res.status(400).json({
        error:
          "resource id, resource type, availability, bookedBy, bookedByModel is required!",
      });
    }

    const foundResource = await resourceModel.findById(id).exec();

    if (foundResource) {
      const updatedResource = await resourceModel
        .findByIdAndUpdate(
          foundResource._id,
          {
            resource_type,
            resource_name,
            availability,
            bookedBy: null,
            bookedByModel: "",
          },
          { new: true }
        )
        .exec();

      if (updatedResource) {
        return res.status(200).json(updatedResource);
      } else {
        return res.status(400).json({
          error: "resource details can not be updated! server error!",
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

module.exports = updateResourceByObjectId;

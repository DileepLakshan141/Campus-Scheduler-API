const resourceModel = require("../models/resource.model");

const AddNewResource = async (req, res) => {
  const { resource_id, resource_type, resource_name } = req.body;

  //cehck essential details are provided or not
  if ((!resource_id, !resource_type, !resource_name)) {
    return res.status(400).json({
      error: "please provide necessary details! (resource id , name and type)",
    });
  }

  const resourceIdFormat = /^(LIB|LAB|CR|AUD|PROJ|LH)\d{4}$/;

  const validateResourceId = (id) => {
    return resourceIdFormat.test(id);
  };

  //validate the resource id format
  if (!validateResourceId(resource_id)) {
    return res.status(400).json({
      error: "resource id is not in correct format!",
      message:
        "it should start with either LIB,LAB,CR,AUD,PROJ,LH and then 4 digits.",
      sample: "CR9020",
    });
  }

  //check if there is a duplicate with same resource id
  const duplicateResourceId = await resourceModel
    .findOne({ resource_id })
    .exec();

  if (duplicateResourceId) {
    return res.status(400).json({
      error: "resource id already existing in the database!",
    });
  }

  const createdResource = await resourceModel.create({
    resource_id,
    resource_name,
    resource_type,
    bookedBy: null,
  });

  if (createdResource) {
    return res.status(201).json(createdResource);
  } else {
    return res
      .status(400)
      .json({ error: "resource could not be created! action unsuccessful!" });
  }
};

module.exports = AddNewResource;

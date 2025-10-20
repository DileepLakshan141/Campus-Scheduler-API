const resourceModel = require("../models/resource.model");
const facultyModel = require("../models/faculty.model");
const adminModel = require("../models/admin.model");
const errorLogger = require("../middlewares/eventLoggerMiddleware");

const releaseResource = async (req, res) => {
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

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "resource id is required!" });
  }

  try {
    //check there is a resource with entered object id
    const foundResource = await resourceModel.findById(id).exec();

    if (!foundResource) {
      return res.status(400).json({
        error: "no resource that match with the entered id! invalid id!",
      });
    }

    // check availability of the resource
    if (foundResource.availability) {
      return res.status(400).json({
        error: "action not allowed! resource is not booked yet!",
        cause: "this resource is currently available",
      });
    } else {
      if (
        foundUser._id.toString() === foundResource.bookedBy.toString() &&
        foundUserRole === foundResource.bookedByModel
      ) {
        const updatedResource = await resourceModel.findByIdAndUpdate(
          foundResource._id,
          {
            $unset: { bookedBy: "", bookedByModel: "" },
            availability: true,
          },
          { new: true }
        );

        if (updatedResource) {
          return res
            .status(200)
            .json({ message: "resource released successfully!" });
        } else {
          return res.status(400).json({
            error:
              "resource releasing unsuccessful! error occured while releasing the resource!",
          });
        }
      } else {
        return res.status(400).json({
          error: "action not allowed!",
          cause: "this resource is not booked with your user credentials!",
        });
      }
    }
  } catch (error) {
    errorLogger(
      "Invalid or empty value passed as object id in releaseResource controller.",
      "errors.txt"
    );
    return res.status(500).json({ error: "internal server error!" });
  }
};

module.exports = releaseResource;

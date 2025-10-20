const express = require("express");
const router = express.Router();
const auth_roles = require("../config/userRoles");
const verifyRoles = require("../middlewares/verifyRolesMiddleware");
const getAllResources = require("../controllers/getAllResources.controller");
const getResourceById = require("../controllers/getResource.controller");
const createResource = require("../controllers/createResource.controller");
const bookResource = require("../controllers/bookResource.controller");
const releaseResource = require("../controllers/releaseResource.controller");
const updateResource = require("../controllers/updateResource.controller");
const deleteResource = require("../controllers/deleteResource.controller");

const { Faculty, Admin } = auth_roles;

router.get("/get-all", verifyRoles(Faculty, Admin), getAllResources);

router.get("/get/:id", verifyRoles(Faculty, Admin), getResourceById);

router.post("/create", verifyRoles(Admin), createResource);

router.put("/book-resource/:id", verifyRoles(Faculty, Admin), bookResource);

router.put(
  "/release-resource/:id",
  verifyRoles(Faculty, Admin),
  releaseResource
);

router.put("/update-resource/:id", verifyRoles(Admin), updateResource);

router.delete("/delete-resource/:id", verifyRoles(Admin), deleteResource);

module.exports = router;

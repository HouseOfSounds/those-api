const { Router } = require("express");
const controller = require("../app/module/organisations/controller");
const validations = require("../app/validations");
const { validator } = require("../app/validations/validator");
const authMiddleware = require("../app/middlewares/authmiddleware");

const route = Router();

route.get("/organisations", (req, res) => {
  console.log("Organisations");
  res.send("Organisations endpoint");
  try {
  } catch (error) {
    console.log(error);
  }
});

route.post(
  "/organisation/create-organisation",
  authMiddleware,
  validator(validations.Organisation),
  controller.createOrganisation
);

route.delete(
  "/organisation/delete-organisation/:organisationid",
  authMiddleware,
  controller.deleteOrganisation
);

route.get(
  "/organisation/list-organisations",
  authMiddleware,
  controller.listOrganisations
);

route.put(
  "/organisation/edit-organisation/:organisationid",
  authMiddleware,
  validator(validations.Organisation),
  controller.editOrganisation
);

module.exports = route;

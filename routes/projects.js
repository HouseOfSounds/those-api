const { Router } = require("express");
const controller = require("../app/module/projects/controller");
const validations = require("../app/validations");
const { validator } = require("../app/validations/validator");
const authMiddleware = require("../app/middlewares/authmiddleware");

const route = Router();

route.get("/projects", (req, res) => {
  console.log("Projects");
  res.send("Projects endpoint");
  try {
  } catch (error) {
    console.log(error);
  }
});

route.post(
  "/project/create-project",
  authMiddleware,
  validator(validations.Project),
  controller.createProject
);

route.post(
  "/project/create-project/:organisationid",
  authMiddleware,
  validator(validations.Project),
  controller.createProject
);

route.delete(
  "/project/delete-project/:projectid",
  authMiddleware,
  controller.deleteProject
);

route.get("/project/list-projects", authMiddleware, controller.listProjects);

route.put(
  "/project/edit-project/:projectid",
  authMiddleware,
  validator(validations.Project),
  controller.editProject
);

module.exports = route;

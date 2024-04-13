const { Router } = require("express");
const controller = require("../app/module/tasks/controller");
const validations = require("../app/validations");
const { validator } = require("../app/validations/validator");
const authMiddleware = require("../app/middlewares/authmiddleware");

const route = Router();

route.get("/tasks", (req, res) => {
  console.log("Tasks");
  res.send("Tasks endpoint");
  try {
  } catch (error) {
    console.log(error);
  }
});

route.post(
  "/task/create-task",
  authMiddleware,
  validator(validations.Task),
  controller.createTask
);

route.post(
  "/task/create-task/:projectid",
  authMiddleware,
  validator(validations.Task),
  controller.createTask
);

route.delete(
  "/task/delete-task/:taskid",
  authMiddleware,
  controller.deleteTask
);

route.get("/task/list-tasks", authMiddleware, controller.listTasks);

route.get("/task/list-tasks/:projectid", authMiddleware, controller.listTasks);

route.put(
  "/task/edit-task/:taskid",
  authMiddleware,
  validator(validations.Task),
  controller.editTask
);

module.exports = route;

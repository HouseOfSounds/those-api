const { Router } = require("express");
const controller = require("../app/module/subtasks/controller");
const validations = require("../app/validations");
const { validator } = require("../app/validations/validator");
const authMiddleware = require("../app/middlewares/authmiddleware");

const route = Router();

route.get("/subtasks", (req, res) => {
  console.log("Subtasks");
  res.send("Subtasks endpoint");
  try {
  } catch (error) {
    console.log(error);
  }
});

route.post(
  "/subtask/create-subtask",
  authMiddleware,
  validator(validations.Subtask),
  controller.createSubtask
);

route.post(
  "/subtask/create-subtask/:taskid",
  authMiddleware,
  validator(validations.Subtask),
  controller.createSubtask
);

route.delete(
  "/subtask/delete-subtask/:subtaskid",
  authMiddleware,
  controller.deleteSubtask
);

route.get("/subtask/list-subtasks", authMiddleware, controller.listSubtasks);

route.get(
  "/subtask/list-subtasks/:taskid",
  authMiddleware,
  controller.listSubtasks
);

route.put(
  "/subtask/edit-subtask/:subtaskid",
  authMiddleware,
  validator(validations.Subtask),
  controller.editSubtask
);

module.exports = route;

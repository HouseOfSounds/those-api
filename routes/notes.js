const { Router } = require("express");
const controller = require("../app/module/notes/controller");
const validations = require("../app/validations");
const { validator } = require("../app/validations/validator");
const authMiddleware = require("../app/middlewares/authmiddleware");

const route = Router();

route.get("/notes", (req, res) => {
  console.log("Notes");
  res.send("Notes endpoint");
  try {
  } catch (error) {
    console.log(error);
  }
});

route.post(
  "/notes/create-note",
  authMiddleware,
  validator(validations.Note),
  controller.createNote
);

route.delete(
  "/notes/delete-note/:noteid",
  authMiddleware,
  controller.deleteNote
);

route.get("/notes/list-notes", authMiddleware, controller.listNotes);

route.put(
  "/notes/edit-note/:noteid",
  authMiddleware,
  validator(validations.Note),
  controller.editNote
);

module.exports = route;

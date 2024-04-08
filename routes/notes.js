const { Router } = require("express");
const controller = require("../app/module/notes/controller");
const validations = require("../app/validations");
const { joiValidator } = require("iyasunday");
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

// ensure notes are created per logged in users
route.post(
  "/notes/create-note",
  authMiddleware,
  joiValidator(validations.Note),
  controller.createNote
);

route.delete(
  "/notes/delete-note/:noteid",
  authMiddleware,
  controller.deleteNote
);

route.get("/notes/list-notes", authMiddleware, controller.listNotes);

route.put("/notes/edit-note/:noteid", authMiddleware, controller.editNote);

module.exports = route;

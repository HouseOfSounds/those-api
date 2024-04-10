const { Router } = require("express");
const controller = require("../app/module/messages/controller");
const validations = require("../app/validations");
const { validator } = require("../app/validations/validator");
const authMiddleware = require("../app/middlewares/authmiddleware");

const route = Router();

route.get("/messages", (req, res) => {
  console.log("Messages");
  res.send("Messages endpoint");
  try {
  } catch (error) {
    console.log(error);
  }
});

route.post(
  "/message/create-message",
  validator(validations.contactForm),
  controller.createMessage
);

route.delete(
  "/message/delete-message/:messageid",
  authMiddleware,
  controller.deleteMessage
);

route.get("/message/list-messages", authMiddleware, controller.listMessages);

route.put(
  "/message/edit-message/:messageid",
  authMiddleware,
  validator(validations.contactForm),
  controller.editMessage
);

module.exports = route;

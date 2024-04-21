const { Router } = require("express");
const controller = require("../app/module/invites/controller");
const validations = require("../app/validations");
const { validator } = require("../app/validations/validator");
const authMiddleware = require("../app/middlewares/authmiddleware");

const route = Router();

route.get("/invites", (req, res) => {
  console.log("Invites");
  res.send("Invites endpoint");
  try {
  } catch (error) {
    console.log(error);
  }
});

route.post(
  "/invite/create-invite",
  authMiddleware,
  validator(validations.Invite),
  controller.createInvite
);

route.post(
  "/invite/create-invite/:inviteid",
  authMiddleware,
  validator(validations.Invite),
  controller.createInvite
);

route.delete(
  "/invite/delete-invite/:inviteid",
  authMiddleware,
  controller.deleteInvite
);

route.get("/invite/list-invites", authMiddleware, controller.listInvites);

route.get(
  "/invite/list-invites/:inviteid",
  authMiddleware,
  controller.listInvites
);

route.put(
  "/invite/edit-invite/:inviteid",
  authMiddleware,
  validator(validations.Invite),
  controller.editInvite
);

module.exports = route;

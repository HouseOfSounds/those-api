"use strict";
const { joiValidator } = require("iyasunday");
const { Router } = require("express");
const guard = require("../../utils/middleware");
const controller = require("./controller");
const validation = require("./validation");
const authMiddleware = require("../../middlewares/authmiddleware");

const passport = require("passport");

const route = Router();

route.get("/", (req, res) => {
  res.send("The House of Sound Lives Here !");
});

route.post("/user/signup", joiValidator(validation.signup), controller.signup);

route.post("/user/login", joiValidator(validation.login), controller.login);

route.get("/users", authMiddleware, controller.listUsers);

route.post(
  "/user/forgot-password",
  joiValidator(validation.forgotPassword),
  controller.forgotPassword
);

route.patch(
  "/user/reset-password",
  joiValidator(validation.resetPassword),
  controller.resetPassword
);

route.post("/user/change-password", authMiddleware, controller.changePassword);
route.get("/user/verify-account", controller.verifyAccount);

route.patch(
  "/user/update-profile",
  authMiddleware,
  joiValidator(validation.updateProfile),
  controller.updateProfile
);

module.exports = route;

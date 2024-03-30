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

// //====================
// route.get("/login/success", (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       error: false,
//       message: "Succesfully logged in!",
//       user: req.user,
//     });
//   } else {
//     res.status(403).json({
//       error: true,
//       message: "Not Authorized",
//     });
//   }
// });

// route.get("/login/failed", (req, res) => {
//   res.status(401).json({
//     error: true,
//     message: "Log in failure",
//   });
// });

// route.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: process.env.CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

// route.get("/google", passport.authenticate("google", ["profile", "email"]));

// route.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect(process.env.CLIENT_URL);
// });

module.exports = route;

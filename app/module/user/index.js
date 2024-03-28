"use strict";
const { joiValidator } = require("iyasunday");
const { Router } = require("express");
const guard = require("../../utils/middleware");
const controller = require("./controller");
const validation = require("./validation");

const route = Router();

// const { OAuth2Client } = require("google-auth-library");

// route.post("/", async function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3001");
//   res.header("Referrer-Policy", "no-referrer-when-downgrade");

//   const redirectUrl = process.env.REDIRECT_URL;

//   const oAuth2Client = new OAuth2Client(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     redirectUrl
//   );

//   const authorizeUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: "https://www.googleapis.com/auth/userinfo.profile opnid",
//     prompt: "consent",
//   });

//   res.json({ url: authorizeUrl });
// });

route.get("/", (req, res) => {
  res.send("The House of Sound !");
});
route.post("/user/signup", joiValidator(validation.signup), controller.signup);
route.post("/user/login", joiValidator(validation.login), controller.login);
route.get("/users", controller.listUsers);

route.post(
  "/user/reset-password",
  joiValidator(validation.resetPassword),
  controller.resetPassword
);
route.post("/user/change-password", controller.changePassword);
route.get("/user/verify-account", controller.verifyAccount);

module.exports = route;

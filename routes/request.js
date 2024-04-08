const express = require("express");
const route = express.Router();
const dotenv = require("dotenv");

dotenv.config();
const { OAuth2Client } = require("google-auth-library");

route.get("/", async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
    prompt: "consent",
  });

  // res.json({ url: authorizeUrl });
  //
  res.redirect(authorizeUrl);
});

module.exports = route;

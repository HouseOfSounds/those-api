const express = require("express");
const route = express.Router();
const dotenv = require("dotenv");
// const { google } = require("googleapis");
const axios = require("axios");

const { User } = require("../app/module/user/model");

dotenv.config();

const { OAuth2Client } = require("google-auth-library");

const getUserData = async (access_token) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  return data;
};

// signup
route.get("/", async (req, res, next) => {
  const code = req.query.code;

  try {
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URL
    );

    const tokc = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(tokc.tokens);

    //=============================
    // const oauth2 = google.oauth2({
    //   auth: oAuth2Client,
    //   version: "v2",
    // });

    // const { data } = await oauth2.userinfo.get();
    // console.log("User email:", data.email);
    //=============================

    // console.log("Tokens Acquired");
    const user = oAuth2Client.credentials;
    // console.log("credentials", user);

    const result = await getUserData(user.access_token);
    // console.log(result);

    const { email, name, given_name, family_name, picture } = result;
    const theUser = await User.findOne({ email });
    // let response;
    if (!theUser) {
      const userData = {
        email,
        password: "p@ssword123",
      };

      await axios
        .post(`${process.env.API_URL}/user/signup`, userData)
        .then((response) => {
          console.log("User signed up successfully:", response.data);
          // res.send(response.data);
          //redirect to dashboard on FE
          res.redirect(process.env.CLIENT_URL);
        })
        .catch((error) => {
          console.error("Error signing up user:", error.response.data);
          // res.send(error.response.data);
          // res.send("sign up error", error.response.data);
          //redirect to home page on FE
          res.redirect(process.env.CLIENT_URL);
        });
    } else {
      await axios
        .post(`${process.env.API_URL}/user/autologin`, { email })
        .then((response) => {
          console.log("User logged in successfully:", response.data);
          // res.send(response.data);
          //redirect to dashboard on FE
          res.redirect(`${process.env.CLIENT_URL}/frame/profile-admin`);
        })
        .catch((error) => {
          console.error("Error signing up user:", error.response.data);
          // res.send(error.response.data);
          // res.send("sign up error", error.response.data);
          //redirect to home page on FE
          res.redirect(process.env.CLIENT_URL);
        });
    }

    // res.send("Authorization completed.");
  } catch (err) {
    throw err;
    // console.log({ error: "Google Sign Up Error", err });
  }
});

module.exports = route;

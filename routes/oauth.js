const express = require("express");
const route = express.Router();
const dotenv = require("dotenv");
// const { google } = require("googleapis");
const axios = require("axios");

dotenv.config();

const { OAuth2Client } = require("google-auth-library");

const getUserData = async (access_token) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  return data;
};

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
    console.log("Tokens Acquired");

    const user = oAuth2Client.credentials;
    console.log("credentials", user);

    const result = await getUserData(user.access_token);

    // const { email, name, given_name, family_name, picture } = result;
    const userData = {
      email: result.email,
      password: "p@ssword123",
    };

    axios
      .post(`${process.env.CLIENT_URL}/user/signup`, userData)
      .then((response) => {
        console.log("User signed up successfully:", response.data);
        // res.send(response.data);
        res.send("sign up successful");
        //redirect to dashboard on FE
      })
      .catch((error) => {
        console.error("Error signing up user:", error.response.data);
        // res.send(error.response.data);
        res.send("sign up error");
        //redirect to home page on FE
      });

    // res.send("Authorization completed.");
  } catch (err) {
    console.log({ error: "Google Sign Up Error", err });
  }
});

module.exports = route;

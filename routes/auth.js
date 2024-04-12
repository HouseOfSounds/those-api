const express = require("express");
const route = express.Router();
const passport = require("passport");
const { User } = require("../app/module/user/model");
const axios = require("axios");

route.get("/login/success", async (req, res) => {
  if (req.user) {
    // res.status(200).json({
    //   error: false,
    //   message: `Succesfully logged in!`,
    //   user: req.user,
    // });

    ///sign the user in or sign user up
    //***************************************** */
    const { email, name, given_name, family_name, picture } = req.user._json;
    const theUser = await User.findOne({ email });

    if (!theUser) {
      //signup new user
      const userData = {
        email,
        password: "p@ssword123",
      };
      console.log("new sign up", userData);

      await axios
        .post(`${process.env.API_URL}/user/signup`, userData)
        .then(async (response) => {
          console.log("User signed up successfully:", email);

          // sign user in
          await axios
            .post(`${process.env.API_URL}/user/autologin`, { email })
            .then((response) => {
              console.log("new sign in:", email);
              //redirect to dashboard on FE
              res.redirect(`${process.env.CLIENT_URL}/frame/profile-admin`);
            });
        })
        .catch((error) => {
          console.error("Error signing up user:", error.response.data);
          //redirect to home page on FE
          res.redirect(process.env.CLIENT_URL);
        });
    } else {
      //sign in user
      await axios
        .post(`${process.env.API_URL}/user/autologin`, { email })
        .then((response) => {
          console.log("old sign in:", email);
          //redirect to dashboard on FE
          res.redirect(`${process.env.CLIENT_URL}/frame/profile-admin`);
        })
        .catch((error) => {
          console.error("Error signing up user:", error.response.data);
          res.redirect(process.env.CLIENT_URL);
        });
    }
    //***************************************** */
  } else {
    res.status(403).json({
      error: true,
      message: "Not Authorized",
    });
  }
});

route.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

// route.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     // successRedirect: "/v1/auth/login/success",
//     successRedirect: process.env.REDIRECT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

route.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    console.log("wew");
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id:
          "280037702045-gj1cujpadkitvd690ilo6vfdfg2ptvai.apps.googleusercontent.com",
        client_secret: process.env.CLIENT_SECRET,
        // redirect_uri: 'http://localhost:3000/v1/auth/google/callback',
        redirect_uri: process.env.REDIRECT_URL,
        grant_type: "authorization_code",
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Use the access token to fetch user info
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const email = userInfoResponse.data.email;

    res.send(`Logged in user's email: ${email}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//=================================
//---------------------------------------------
route.get("/gauth", async (req, res) => {
  console.log("Google Authentication");
  try {
    const response = await axios.get(
      "https://accounts.google.com/o/oauth2/v2/auth",
      {
        params: {
          response_type: "code",
          redirect_uri: process.env.REDIRECT_URL,
          scope: "profile email",
          client_id: process.env.CLIENT_ID,
        },
      }
    );

    // const email = response.data.email || "Email not provided";
    // res.send(email);
    console.log(response);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
//---------------------------------------------
//=================================

route.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

route.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = route;

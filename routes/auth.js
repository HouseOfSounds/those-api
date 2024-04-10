const express = require("express");
const route = express.Router();
const passport = require("passport");

const axios = require("axios");
const { User } = require("../app/module/user/model");

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
          console.log("User signed up successfully:", response.data);

          // sign user in
          await axios
            .post(`${process.env.API_URL}/user/autologin`, { email })
            .then((response) => {
              console.log("new sign in:", response.data);
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
          console.log("old sign in:", response.data);
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

route.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: process.env.CLIENT_URL,
    successRedirect: "/v1/auth/login/success",
    failureRedirect: "/login/failed",
  })
);

route.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

route.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

// route.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//   });

//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Error destroying session:", err);
//       return next(err);
//     }
//     res.redirect(process.env.CLIENT_URL);
//   });
// });

module.exports = route;

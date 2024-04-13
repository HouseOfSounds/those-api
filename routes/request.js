const { Router } = require("express");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const axios = require("axios");

const route = Router();

const app = express();

// app.use(cors({ credentials: true }));
app.use(cors());

app.use((req, res, next) => {
  //allow access from every, elminate CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.removeHeader("x-powered-by");
  //set the allowed HTTP methods to be requested
  res.setHeader("Access-Control-Allow-Methods", "POST");
  //headers clients can use in their requests
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  //allow request to continue and be handled by routes
  next();
});

const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(
  session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/v1/oauth/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      //===========================
      const { User } = require("../app/module/user/model");

      const { email, name, given_name, family_name, picture } = profile._json;
      const theUser = User.findOne({ email });

      if (!theUser) {
        const userData = {
          email,
          password: "p@ssword123",
        };

        //signup new user
        await axios
          .post(`${process.env.API_URL}/user/signup`, userData)
          .then((response) => {
            console.log("User signed up successfully:", response.data);

            return {
              user: response.data,
              message: "User signed up successfully",
            };
          })
          .catch((error) => {
            console.error("Error signing up user:", error.response.data);

            return {
              message: "Internal Server Error !",
            };
          });
      } else {
        //sign in user
        await axios
          .post(`${process.env.API_URL}/user/autologin`, { email })
          .then((response) => {
            console.log("User logged in successfully:", response.data);

            return {
              user: response.data,
              message: "User signed in successfully",
            };
          })
          .catch((error) => {
            console.error("Error signing up user:", error.response.data);

            return {
              message: "Internal Server Error !",
            };
          });
      }

      // ===========================

      // console.log("The User", theUser);

      return done(null, profile);
    }
  )
);

route.get(
  "/request",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

route.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res, next) {
    // Successful authentication, redirect home.
    // res.redirect("/");
    // console.log("Authenticated", req.user._json);

    res.send(req.user._json);
    // // return req.user._json;
    // next();
  }
);

module.exports = route;

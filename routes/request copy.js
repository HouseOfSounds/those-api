const { Router } = require("express");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");

const route = Router();

const app = express();

// route.use(cors());

app.use(
  cors({
    origin: "http://localhost:3001", // Replace with your frontend domain
    credentials: true, // Enable CORS credentials (e.g., cookies, authorization headers)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
      const axios = require("axios");

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

      //===========================

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
  function (req, res) {
    // Successful authentication, redirect home.
    // res.redirect("/");
    console.log("Authenticated");
    res.send("Authentication Completed");
  }
);

module.exports = route;

const { Router } = require("express");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
// const cors = require("cors");
const axios = require("axios");

const route = Router();

const app = express();

// app.use(cors());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3001");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   // Optionally, if you're using cookies or sessions with credentials
//   // res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

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
    // res.send(req.user);
    // // return req.user._json;
    // next();
  }
);

route.get("/api/proxy", async (req, res) => {
  try {
    // const response = await axios.get("http://localhost:3000/v1/oauth/request");
    // // res.json(response.data);
    // res.send(response.data);
    res.redirect("http://localhost:3000/v1/oauth/request");
  } catch (error) {
    console.error("Proxy request error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = route;

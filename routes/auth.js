const express = require("express");
const route = express.Router();
const passport = require("passport");

route.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: `Succesfully logged in!`,
      user: req.user,
    });
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
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

route.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// route.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect(process.env.CLIENT_URL);
// });

route.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return next(err);
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = route;

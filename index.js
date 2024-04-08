require("dotenv").config();
const express = require("express");
// const cors = require("cors");
const passport = require("passport");
const cookeSession = require("cookie-session");
const session = require("express-session");
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");

const middlewares = require("./app/routes/middleware");
// const routes = require("./app/routes");
const connectDB = require("./app/config/db");

const app = express();
middlewares(app);
// routes(app);

// ==========================================
const user = require("./app/module/user");
const version = "/v1";
app.use(version, user); //user route
// ==========================================

//----conflicting with session below
// app.use(
//   cookeSession({
//     name: "session",
//     keys: ["codeweaver"],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// google auth with passport
app.use(`${version}/auth`, authRoute);

// google oAuth
const oauth = require("./routes/oauth");
app.use(`${version}/oauth`, oauth);

// google oAuth request
const oauthReq = require("./routes/request");
app.use(`${version}/oauth/request`, oauthReq);

// ========== Add Other Routes from here on
const notes = require("./routes/notes");
app.use(version, notes);
// ==========   End of Routes   ==========

(async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, (err) => {
      if (err) {
        console.error("Error: ", err);
        throw err;
      }
      console.log(`Server active on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Error: ", err);
    process.exit(1);
  }
})();

require("dotenv").config();
const express = require("express");
// const cors = require("cors");
const passport = require("passport");
const cookeSession = require("cookie-session");
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");

const middlewares = require("./app/routes/middleware");
const routes = require("./app/routes");
const connectDB = require("./app/config/db");

const app = express();
middlewares(app);
// routes(app);

// ==========================================
const user = require("./app/module/user");
const version = "/v1";
app.use(version, user);
// ==========================================

app.use(
  cookeSession({
    name: "session",
    keys: ["codeweaver"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);

//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );

app.use(`${version}/auth`, authRoute);

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

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const passport = require("passport");
const cookieSession = require("cookie-session");
const session = require("express-session");
// const passportSetup = require("./passport");

const middlewares = require("./app/routes/middleware");
// const routes = require("./app/routes");
const connectDB = require("./app/config/db");

const app = express();

// +++++++++++++++++++++++++++++++++++++++++++++

app.use(
  cors({
    // origin: "http://localhost:3001",
    // optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

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

app.use(
  cookieSession({
    name: "session",
    keys: ["codeweaver"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

middlewares(app);
// routes(app);

// ==========================================
const user = require("./app/module/user");
const version = "/v1";
app.use(version, user); //user route
// ==========================================

// google auth with passport
// const authRoute = require("./routes/auth");
// app.use(`${version}/auth`, authRoute);

// google oAuth
// const oauth = require("./routes/oauth");
// app.use(`${version}/oauth`, oauth);

// ========== Add Other Routes from here on

// google oAuth request
const oauthReq = require("./routes/request");
app.use(`${version}/oauth`, oauthReq);

//Notes route
const notes = require("./routes/notes");
app.use(version, notes);

//Projects route
const projects = require("./routes/projects");
app.use(version, projects);

//Organisations route
const organisations = require("./routes/organisations");
app.use(version, organisations);

//Messages route
const messages = require("./routes/messages");
app.use(version, messages);

//Tasks route
const tasks = require("./routes/tasks");
app.use(version, tasks);

//Subtasks route
const subtasks = require("./routes/subtasks");
app.use(version, subtasks);

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

    // ===========================================
    // const path = require("path");
    // app.use(express.static(path.join(__dirname)));

    // const https = require("https");
    // const fs = require("fs");

    // const options = {
    //   key: fs.readFileSync("./cert/key.pem"),
    //   cert: fs.readFileSync("./cert/cert.pem"),
    //   secureProtocol: "TLSv1_2_method",
    // };

    // const server = https.createServer(options, app, (req, res) => {
    //   res.writeHead(200);
    //   res.end("HTTPS server is working with a self-signed certificate!");
    // });

    // const port = process.env.PORT || 443;
    // const hostname = "localhost";

    // server.listen(port, () => {
    //   console.log(`Server running at https://${hostname}:${port}/`);
    // });

    // ===========================================
  } catch (err) {
    console.error("Error: ", err);
    process.exit(1);
  }
})();

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const passport = require("passport");
const cookieSession = require("cookie-session");
const session = require("express-session");
// const passportSetup = require("./passport");

const middlewares = require("./app/routes/middleware");
// const routes = require("./app/routes");
const connectDB = require("./app/config/db");

const app = express();

// +++++++++++++++++++++++++++++++++++++++++++++

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (origin.includes("http://localhost:3000")) return callback(null, true);

//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://beatlab.vercel.app"],
//     methods: [
//       "GET",
//       "HEAD",
//       "POST",
//       "PUT",
//       "DELETE",
//       "CONNECT",
//       "OPTIONS",
//       "TRACE",
//       "PATCH",
//     ],
//     credentials: true,
//   })
// );

app.use(cors());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

// app.use((req, res, next) => {
//   const allowedOrigins = [
//     "https://beatlab.vercel.app",
//     "http://beatlab.vercel.app",
//     "http://localhost:3000",
//   ];
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }

//   next();
// });
// +++++++++++++++++++++++++++++++++++++++++++++

// app.use(
//   session({
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false },
//   })
// );

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

// //---------------------------------------------
// app.get("/gauth", async (req, res) => {
//   console.log("Google Authentication");
//   try {
//     const response = await axios.get(
//       "https://accounts.google.com/o/oauth2/v2/auth",
//       {
//         params: {
//           response_type: "code",
//           redirect_uri: process.env.REDIRECT_URL,
//           scope: "profile email",
//           client_id: process.env.CLIENT_ID,
//         },
//       }
//     );

//     res.send(response.data);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// //---------------------------------------------

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

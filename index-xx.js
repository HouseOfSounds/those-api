const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const middlewares = require("./app/routes/middleware");
const connectDB = require("./app/config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
middlewares(app);

// Routes
const version = "/v1";
app.use(version, require("./app/module/user"));
app.use(version, require("./routes/request"));
app.use(version, require("./routes/notes"));
app.use(version, require("./routes/projects"));
app.use(version, require("./routes/organisations"));
app.use(version, require("./routes/messages"));
app.use(version, require("./routes/tasks"));
app.use(version, require("./routes/subtasks"));
app.use(version, require("./routes/invites"));

app.get(`${version}/beroute`, (req, res) => {
  res.status(200).json({
    beUrl: "http://51.20.37.195:3000",
  });
});

// HTTPS Server Configuration
const options = {
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
  rejectUnauthorized: false,
};

const server = https.createServer(options, app);

const port = process.env.PORT || 443;

server.listen(port, () => {
  console.log(`Server running on ${port}`);
});

// Database Connection
(async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
})();

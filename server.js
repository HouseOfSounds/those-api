require("dotenv").config();
const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
const middlewares = require("./app/routes/middleware");
const routes = require("./app/routes");
const connectDB = require("./app/config/db");

const app = express();
middlewares(app);
routes(app);

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

    // const sslServer = https.createServer(
    //   {
    //     key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    //     cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
    //   },
    //   app
    // );

    // sslServer.listen("443", (err) => {
    //   if (err) {
    //     console.error("Error: ", err);
    //     throw err;
    //   }
    //   console.log(`Server active on port ${process.env.PORT}`);
    // });
  } catch (err) {
    console.error("Error: ", err);
    process.exit(1);
  }
})();

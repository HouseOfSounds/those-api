"use strict";
const bodyParser = require("body-parser");
const cors = require("cors");
const { raw } = require("express");
//import cookieParser from 'cookie-parser';

module.exports = function (app) {
  if (process.env.NODE_ENV === "production") {
    console.log("Production");
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  //app.use(cookieParser());

  // app.use(
  //   cors({
  //     origin: (origin, callback) => {
  //       if (!origin) return callback(null, true);
  //       if (origin.includes("http://localhost:3000"))
  //         return callback(null, true);

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

  app.use((req, res, next) => {
    const allowedOrigins = [
      "https://beatlab.vercel.app",
      "http://beatlab.vercel.app",
      "http://localhost:3000",
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    next();
  });

  // app.use(raw());

  if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
      console.log(`${req.method} >> ${req.get("HOST")}${req.originalUrl}`);
      if (req.body) console.log("========Request body==========\n", req.body);
      if (req.params)
        console.log("========Request params==========\n", req.params);
      if (req.query)
        console.log("========Request query string==========\n", req.query);
      if (req.headers.authorization)
        console.log("====Auth token====\n", req.headers.authorization);

      next();
    });
  }
};

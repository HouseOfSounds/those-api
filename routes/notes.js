const { Router } = require("express");
const controller = require("../app/module/notes/controller");
const validations = require("../app/validations");
const authMiddleware = require("../app/middlewares/authmiddleware");

const route = Router();

route.get("/notes", () => console.log("Notes"));

module.exports = route;

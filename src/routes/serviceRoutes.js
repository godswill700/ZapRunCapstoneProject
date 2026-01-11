const express = require("express");
const routes = express.Router();
const { createService, getServices } = require("../controllers/service.controller");

routes.post("/", createService);
routes.get("/", getServices);

module.exports = routes;
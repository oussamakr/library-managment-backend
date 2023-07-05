const express = require("express");
const { Refrech_token } = require("../Controllers/RefreshController");

const Route = express.Router();

Route.get("/refresh_token", Refrech_token);

module.exports = Route;

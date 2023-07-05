const express = require("express");
const { login } = require("../Controllers/clientController");

const Route = express.Router();

Route.post("/login_client", login);

module.exports = Route;

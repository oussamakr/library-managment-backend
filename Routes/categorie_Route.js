const express = require("express");
const { getCategories } = require("../Controllers/categorieController");

const Route = express.Router();

Route.get("/all_categorie", getCategories);

module.exports = Route;

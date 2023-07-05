const express = require("express");
const {
  telechargerPDF,
} = require("../Controllers/telechargementPdfController");

const router = express.Router();

router.get("/telechargement/:nomFichier", telechargerPDF);

module.exports = router;

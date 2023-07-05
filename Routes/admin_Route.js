const express = require("express");
const {
  ajouterCategorie,
  ajouterLivreDansCategorie,
  ajouterClient,
  getAllClients,
  supprimerClient,
  getAllLivres,
} = require("../Controllers/adminController");
const Route = express.Router();

const upload = require("../Middelwears/Multer");

//categorie & livre
Route.post("/add_categorie", ajouterCategorie);
Route.post(
  "/add_livre",

  upload.single("file"),
  ajouterLivreDansCategorie
);

// crud Client
Route.post("/add_client", ajouterClient);
Route.get("/get_client", getAllClients);
Route.delete("/sup_client/:id", supprimerClient);

Route.get("/get_livre", getAllLivres);

module.exports = Route;

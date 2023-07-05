const mongoose = require("mongoose");

const livreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  auteur: { type: String, required: true },
  description: { type: String, required: true },
  cheminFichier: { type: String, required: true },
  nomcategorie: { type: String, required: true },

  // Chemin vers le fichier PDF
});

const Livre = mongoose.model("Livre", livreSchema);

module.exports = Livre;

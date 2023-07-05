const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true },
  motDePasse: { type: String, required: true },
  type: { type: String, enum: ["normal", "abonne"], default: "normal" },
  refreshtoken: { type: String },
});

const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);

module.exports = Utilisateur;

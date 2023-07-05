const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
  nomcategorie: { type: String, required: true },
  listeDesLivres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livre' }]
});

const Categorie = mongoose.model('Categorie', categorieSchema);

module.exports = Categorie;

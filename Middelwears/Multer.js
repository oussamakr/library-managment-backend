const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Répertoire où les fichiers seront enregistrés
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nom du fichier
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

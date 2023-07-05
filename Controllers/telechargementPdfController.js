const path = require("path");

exports.telechargerPDF = async (req, res) => {
  try {
    const nomFichier = req.params.nomFichier;
    console.log("aaaaaaaa" + nomFichier);
    // Récupérer le chemin complet du fichier PDF
    const cheminComplet = path.resolve(__dirname, "..", nomFichier);

    // Envoyer le fichier en tant que téléchargement
    res.download(cheminComplet, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Échec du téléchargement du fichier" });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors du téléchargement du fichier" });
  }
};

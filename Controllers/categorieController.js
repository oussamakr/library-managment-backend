const Categorie = require("../Models/Model_Categorie");

exports.getCategories = async (req, res) => {
  try {
    // Récupérer toutes les catégories
    const categories = await Categorie.find();

    // Vérifier s'il y a des catégories disponibles
    if (categories.length === 0) {
      return res.status(404).json({ message: "Aucune catégorie disponible" });
    }

    // Retourner les catégories
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des catégories" });
  }
};

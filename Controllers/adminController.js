const Categorie = require("../Models/Model_Categorie");
const Client = require("../Models/Model_Utilisateur");

const Livre = require("../Models/Model_Livre");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Fonction pour ajouter une catégorie
// Controller - Ajouter une catégorie
exports.ajouterCategorie = async (req, res) => {
  try {
    const { nomcategorie } = req.body;

    // Vérifier si la catégorie existe déjà
    const categorieExistante = await Categorie.findOne({ nomcategorie });
    if (categorieExistante) {
      return res.status(409).json({ message: "La catégorie existe déjà" });
    }

    // Créer une nouvelle catégorie
    const nouvelleCategorie = new Categorie({ nomcategorie });

    // Enregistrer la catégorie dans la base de données
    await nouvelleCategorie.save();

    return res.status(201).json({ message: "Catégorie ajoutée avec succès" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de la catégorie" });
  }
};

// Fonction pour ajouter un livre à une catégorie
exports.ajouterLivreDansCategorie = async (req, res) => {
  try {
    const { titre, auteur, description, categorieId } = req.body;

    // Vérifier si le livre existe déjà dans la catégorie
    const livreExistant = await Livre.findOne({ titre, auteur });

    if (livreExistant) {
      return res.json({ message: "Ce livre existe déjà dans une catégorie" });
    }

    // Vérifier si la catégorie existe
    const categorieExistante = await Categorie.findOne({
      nomcategorie: categorieId,
    });

    if (!categorieExistante) {
      return res.status(404).json({ message: "La catégorie n'existe pas" });
    }

    // Vérifier si un fichier a été téléchargé
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Veuillez télécharger un fichier PDF" });
    }

    // Vérifier si le fichier PDF existe déjà dans les livres
    const fichierExistant = await Livre.findOne({
      cheminFichier: req.file.path,
    });

    if (fichierExistant) {
      return res.status(400).json({ message: "Ce fichier PDF existe déjà" });
    }

    // Créer un nouveau livre
    const nouveauLivre = new Livre({
      titre,
      auteur,
      description,
      nomcategorie: categorieId,
      cheminFichier: req.file.path, // Utilisez le chemin du fichier téléchargé
    });

    // Enregistrer le livre dans la base de données
    const livreEnregistre = await nouveauLivre.save();

    // Vérifier si le livre est déjà associé à une autre catégorie
    const livreDansAutreCategorie = await Categorie.findOne({
      listeDesLivres: livreEnregistre._id,
    });

    if (livreDansAutreCategorie) {
      await Livre.findByIdAndRemove(livreEnregistre._id); // Supprimer le livre nouvellement créé
      return res.json({
        message: "Ce livre est déjà associé à une autre catégorie",
      });
    }

    // Ajouter le livre à la catégorie
    categorieExistante.listeDesLivres.push(livreEnregistre._id);
    await categorieExistante.save();

    return res.json({ message: "Livre ajouté avec succès à la catégorie" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du livre à la catégorie" });
  }
};

// Fonction pour envoyer un e-mail
async function envoyerEmail(destinataire, sujet, message) {
  // Configuration du transporteur de messagerie
  const transporteur = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.ADRESSE,
      pass: process.env.PASSWORD,
    },
  });

  // Options de l'e-mail
  const optionsEmail = {
    from: process.env.ADRESSE,
    to: destinataire,
    subject: sujet,
    html: message,
  };

  // Envoi de l'e-mail
  await transporteur.sendMail(optionsEmail);
}
// Controller - Ajouter un client
exports.ajouterClient = async (req, res) => {
  try {
    const { nom, email, motDePasse, type } = req.body;

    // Vérifier si le client existe déjà
    const clientExist = await Client.findOne({ email });
    if (clientExist) {
      return res.status(409).json({ message: "Ce client existe déjà" });
    }

    const hash_Password = bcrypt.hashSync(motDePasse, 10);

    // Créer un nouveau client
    const nouveauClient = new Client({
      nom,
      email,
      motDePasse: hash_Password,
      type,
    });

    // Enregistrer le client dans la base de données
    const save_client = await nouveauClient.save();

    if (save_client) {
      const message = `
        <h1>Hello ${save_client.nom},</h1><br>
        <ul>
         <li><strong>Account succussfuly created</strong></li>
         <li>Your email : ${email} .</li>
         <li>Your password : ${motDePasse} </li>
        </ul>
        <p>Cordialement</p>`;
      await envoyerEmail(email, "Created Account", message);
      return res.status(201).json({ message: "Client ajouté avec succès" });
    } else {
      return res.status(400).json({
        message:
          "Erreur lors de l'enregistrement du client dans la base de données",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du client" });
  }
};
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des clients" });
  }
};

// Supprimer un client par ID
exports.supprimerClient = async (req, res) => {
  try {
    const clientId = req.params.id;

    // Vérifier si le client existe
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: "Le client n'existe pas" });
    }

    // Supprimer le client de la base de données
    await Client.findByIdAndRemove(clientId);

    return res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression du client" });
  }
};

exports.getAllLivres = async (req, res) => {
  try {
    const livres = await Livre.find();
    res.json(livres);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des livres" });
  }
};

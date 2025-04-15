const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import des routes
const contactRoutes = require('./routes/contacts');
const groupRoutes = require('./routes/groups');

// Import du middleware d'erreur
const errorHandler = require('./middleware/errorHandler');

// Création de l'application Express
const app = express();

// Configuration de la base de données
const connectDB = require('./config/database');
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/groups', groupRoutes);

// Route d'accueil
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API du gestionnaire de contacts' });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Port et démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.log('ERREUR NON GÉRÉE:', err.message);
  console.log('Arrêt du serveur...');
  process.exit(1);
});

module.exports = app;
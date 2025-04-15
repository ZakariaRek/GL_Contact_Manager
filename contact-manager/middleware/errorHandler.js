/**
 * Middleware de gestion des erreurs
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  let error = { ...err };
  error.message = err.message;
  
  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: message
    });
  }
  
  // Erreur d'ID Mongoose
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      error: `Ressource non trouvée avec l'id ${err.value}`
    });
  }
  
  // Erreur de duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Une ressource avec cette valeur existe déjà'
    });
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erreur serveur'
  });
};

module.exports = errorHandler;
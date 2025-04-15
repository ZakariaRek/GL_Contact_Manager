/**
 * Utilitaires de validation pour le gestionnaire de contacts
 */

/**
 * Vérifie si une chaîne est vide ou contient uniquement des espaces
 * @param {string} str - La chaîne à vérifier
 * @returns {boolean} - true si la chaîne est vide, false sinon
 */
const isEmpty = (str) => {
  return !str || str.trim() === '';
};

/**
 * Vérifie si une adresse email est valide
 * @param {string} email - L'email à vérifier
 * @returns {boolean} - true si l'email est valide, false sinon
 */
const isValidEmail = (email) => {
  if (isEmpty(email)) return true; // Email optionnel
  
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
};

/**
 * Vérifie si un numéro de téléphone est valide
 * @param {string} phone - Le numéro de téléphone à vérifier
 * @returns {boolean} - true si le numéro est valide, false sinon
 */
const isValidPhone = (phone) => {
  if (isEmpty(phone)) return false; // Téléphone obligatoire
  
  // Accepte différents formats (international, avec/sans espaces, etc.)
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Vérifie si une couleur hexadécimale est valide
 * @param {string} color - La couleur à vérifier
 * @returns {boolean} - true si la couleur est valide, false sinon
 */
const isValidHexColor = (color) => {
  if (isEmpty(color)) return true; // Couleur optionnelle
  
  const hexColorRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  return hexColorRegex.test(color);
};

/**
 * Normalise un numéro de téléphone (retire les espaces, parenthèses, tirets)
 * @param {string} phone - Le numéro de téléphone à normaliser
 * @returns {string} - Le numéro de téléphone normalisé
 */
const normalizePhone = (phone) => {
  return phone.replace(/[^+0-9]/g, '');
};

/**
 * Normalise une adresse email (trim et lowercase)
 * @param {string} email - L'email à normaliser
 * @returns {string} - L'email normalisé
 */
const normalizeEmail = (email) => {
  return email ? email.trim().toLowerCase() : '';
};

module.exports = {
  isEmpty,
  isValidEmail,
  isValidPhone,
  isValidHexColor,
  normalizePhone,
  normalizeEmail
};
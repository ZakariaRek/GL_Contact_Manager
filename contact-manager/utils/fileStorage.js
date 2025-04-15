const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Parser } = require('json2csv');

/**
 * Utilitaires pour l'importation et l'exportation de contacts
 */

/**
 * Importe des contacts depuis un fichier CSV
 * @param {string} filePath - Chemin du fichier CSV
 * @returns {Promise<Array>} - Promise contenant un tableau des contacts importés
 */
const importContactsFromCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const contacts = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const contact = {
          firstName: data.firstName || data.prenom || '',
          lastName: data.lastName || data.nom || '',
          phoneNumber: data.phoneNumber || data.telephone || '',
          email: data.email || '',
          address: data.address || data.adresse || '',
          notes: data.notes || ''
        };
        
        // Convertir la date de naissance si elle existe
        if (data.birthDate || data.dateNaissance) {
          const birthDateStr = data.birthDate || data.dateNaissance;
          try {
            const birthDate = new Date(birthDateStr);
            if (!isNaN(birthDate.getTime())) {
              contact.birthDate = birthDate;
            }
          } catch (e) {
            console.warn(`Date de naissance invalide ignorée: ${birthDateStr}`);
          }
        }
        
        contacts.push(contact);
      })
      .on('end', () => {
        resolve(contacts);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

/**
 * Exporte des contacts vers un fichier CSV
 * @param {Array} contacts - Tableau des contacts à exporter
 * @param {string} outputPath - Chemin du fichier de sortie
 * @returns {Promise<string>} - Promise contenant le chemin du fichier créé
 */
const exportContactsToCSV = (contacts, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      // Assurez-vous que le répertoire existe
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Préparation des données pour l'export
      const contactsForExport = contacts.map(contact => {
        return {
          firstName: contact.firstName,
          lastName: contact.lastName,
          phoneNumber: contact.phoneNumber,
          email: contact.email || '',
          address: contact.address || '',
          birthDate: contact.birthDate ? contact.birthDate.toISOString().split('T')[0] : '',
          notes: contact.notes || ''
        };
      });
      
      // Création du CSV
      const fields = ['firstName', 'lastName', 'phoneNumber', 'email', 'address', 'birthDate', 'notes'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(contactsForExport);
      
      // Écriture du fichier
      fs.writeFileSync(outputPath, csv);
      resolve(outputPath);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Crée les dossiers nécessaires pour l'application
 */
const createRequiredDirectories = () => {
  const directories = ['uploads', 'exports', 'photos'];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Répertoire créé: ${dir}`);
    }
  });
};

module.exports = {
  importContactsFromCSV,
  exportContactsToCSV,
  createRequiredDirectories
};
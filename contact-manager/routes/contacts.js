const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const path = require('path');

const contactController = require('../controllers/contactController');

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite à 10 Mo
  fileFilter: (req, file, cb) => {
    const filetypes = /csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers CSV sont autorisés!'));
    }
  }
});

// Validation pour la création/mise à jour de contacts
const contactValidation = [
  check('firstName', 'Le prénom est requis').not().isEmpty(),
  check('lastName', 'Le nom est requis').not().isEmpty(),
  check('phoneNumber', 'Le numéro de téléphone est requis').not().isEmpty(),
  check('email', 'Email invalide').optional().isEmail()
];

// Routes
router.route('/')
  .get(contactController.getContacts)
  .post(contactValidation, contactController.createContact);

router.route('/:id')
  .get(contactController.getContactById)
  .put(contactValidation, contactController.updateContact)
  .delete(contactController.deleteContact);

router.route('/:id/groups/:groupId')
  .put(contactController.addContactToGroup)
  .delete(contactController.removeContactFromGroup);

router.post('/import', upload.single('file'), contactController.importContacts);
router.get('/export', contactController.exportContacts);

module.exports = router;
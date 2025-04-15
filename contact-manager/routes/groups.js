const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const groupController = require('../controllers/groupController');

// Validation pour la création/mise à jour de groupes
const groupValidation = [
  check('name', 'Le nom du groupe est requis').not().isEmpty(),
  check('color', 'La couleur doit être un code hexadécimal valide')
    .optional()
    .matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
];

// Routes
router.route('/')
  .get(groupController.getGroups)
  .post(groupValidation, groupController.createGroup);

router.route('/:id')
  .get(groupController.getGroupById)
  .put(groupValidation, groupController.updateGroup)
  .delete(groupController.deleteGroup);

router.get('/:id/contacts', groupController.getGroupContacts);

module.exports = router;
const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');
const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');

/**
 * @desc    Obtenir tous les contacts
 * @route   GET /api/contacts
 * @access  Public
 */
exports.getContacts = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Terme de recherche
    const searchTerm = req.query.search || '';
    
    // Filtrage par groupe
    const groupId = req.query.group;
    
    let query = {};
    
    // Appliquer la recherche
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      query = {
        $or: [
          { firstName: regex },
          { lastName: regex },
          { phoneNumber: regex },
          { email: regex },
          { address: regex },
          { notes: regex }
        ]
      };
    }
    
    // Appliquer le filtre par groupe
    if (groupId) {
      query.groups = groupId;
    }
    
    const contacts = await Contact.find(query)
      .populate('groups', 'name color')
      .skip(startIndex)
      .limit(limit)
      .sort({ lastName: 1, firstName: 1 });
    
    const total = await Contact.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: contacts
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Obtenir un contact par ID
 * @route   GET /api/contacts/:id
 * @access  Public
 */
exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id).populate('groups', 'name color');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Créer un nouveau contact
 * @route   POST /api/contacts
 * @access  Public
 */
exports.createContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const contact = await Contact.create(req.body);
    
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Mettre à jour un contact
 * @route   PUT /api/contacts/:id
 * @access  Public
 */
exports.updateContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    let contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact non trouvé'
      });
    }
    
    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Supprimer un contact
 * @route   DELETE /api/contacts/:id
 * @access  Public
 */
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact non trouvé'
      });
    }
    
    await contact.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Ajouter un contact à un groupe
 * @route   PUT /api/contacts/:id/groups/:groupId
 * @access  Public
 */
exports.addContactToGroup = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact non trouvé'
      });
    }
    
    // Vérifier si le contact est déjà dans le groupe
    if (contact.groups.includes(req.params.groupId)) {
      return res.status(400).json({
        success: false,
        error: 'Contact déjà dans ce groupe'
      });
    }
    
    contact.groups.push(req.params.groupId);
    await contact.save();
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Retirer un contact d'un groupe
 * @route   DELETE /api/contacts/:id/groups/:groupId
 * @access  Public
 */
exports.removeContactFromGroup = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact non trouvé'
      });
    }
    
    // Vérifier si le contact est dans le groupe
    if (!contact.groups.includes(req.params.groupId)) {
      return res.status(400).json({
        success: false,
        error: 'Contact pas dans ce groupe'
      });
    }
    
    contact.groups = contact.groups.filter(
      group => group.toString() !== req.params.groupId
    );
    
    await contact.save();
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Importer des contacts depuis un fichier CSV
 * @route   POST /api/contacts/import
 * @access  Public
 */
exports.importContacts = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez télécharger un fichier CSV'
      });
    }
    
    const contacts = [];
    const filePath = req.file.path;
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        contacts.push({
          firstName: data.firstName || data.prenom || '',
          lastName: data.lastName || data.nom || '',
          phoneNumber: data.phoneNumber || data.telephone || '',
          email: data.email || '',
          address: data.address || data.adresse || '',
          notes: data.notes || ''
        });
      })
      .on('end', async () => {
        try {
          // Supprimer le fichier après traitement
          fs.unlinkSync(filePath);
          
          // Insérer les contacts en base de données
          const insertedContacts = await Contact.insertMany(contacts);
          
          res.status(200).json({
            success: true,
            count: insertedContacts.length,
            data: insertedContacts
          });
        } catch (error) {
          next(error);
        }
      });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Exporter des contacts au format CSV
 * @route   GET /api/contacts/export
 * @access  Public
 */
exports.exportContacts = async (req, res, next) => {
  try {
    // Filtrage par groupe
    const groupId = req.query.group;
    let query = {};
    
    if (groupId) {
      query.groups = groupId;
    }
    
    const contacts = await Contact.find(query).populate('groups', 'name');
    
    // Transformation des données pour l'export
    const contactsForExport = contacts.map(contact => {
      const groupNames = contact.groups.map(g => g.name).join(', ');
      
      return {
        id: contact._id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber,
        email: contact.email || '',
        address: contact.address || '',
        birthDate: contact.birthDate ? contact.birthDate.toISOString().split('T')[0] : '',
        notes: contact.notes || '',
        groups: groupNames
      };
    });
    
    // Création du CSV
    const fields = ['id', 'firstName', 'lastName', 'phoneNumber', 'email', 'address', 'birthDate', 'notes', 'groups'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(contactsForExport);
    
    // Configuration de la réponse pour téléchargement
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="contacts.csv"');
    
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};
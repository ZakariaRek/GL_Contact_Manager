const Group = require('../models/Group');
const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

/**
 * @desc    Obtenir tous les groupes
 * @route   GET /api/groups
 * @access  Public
 */
exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find().sort({ name: 1 });
    
    // Obtenir le nombre de contacts pour chaque groupe
    const groupsWithCounts = await Promise.all(groups.map(async (group) => {
      const count = await Contact.countDocuments({ groups: group._id });
      return {
        ...group.toObject(),
        contactCount: count
      };
    }));
    
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groupsWithCounts
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Obtenir un groupe par ID
 * @route   GET /api/groups/:id
 * @access  Public
 */
exports.getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Groupe non trouvé'
      });
    }
    
    // Obtenir le nombre de contacts dans le groupe
    const contactCount = await Contact.countDocuments({ groups: group._id });
    
    const groupWithCount = {
      ...group.toObject(),
      contactCount
    };
    
    res.status(200).json({
      success: true,
      data: groupWithCount
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Créer un nouveau groupe
 * @route   POST /api/groups
 * @access  Public
 */
exports.createGroup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Vérifier si un groupe avec le même nom existe déjà
    const existingGroup = await Group.findOne({ name: req.body.name });
    if (existingGroup) {
      return res.status(400).json({
        success: false,
        error: 'Un groupe avec ce nom existe déjà'
      });
    }
    
    const group = await Group.create(req.body);
    
    res.status(201).json({
      success: true,
      data: group
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Mettre à jour un groupe
 * @route   PUT /api/groups/:id
 * @access  Public
 */
exports.updateGroup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    let group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Groupe non trouvé'
      });
    }
    
    // Vérifier si le nouveau nom est déjà utilisé par un autre groupe
    if (req.body.name && req.body.name !== group.name) {
      const existingGroup = await Group.findOne({ name: req.body.name });
      if (existingGroup && existingGroup._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          error: 'Un groupe avec ce nom existe déjà'
        });
      }
    }
    
    group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Supprimer un groupe
 * @route   DELETE /api/groups/:id
 * @access  Public
 */
exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Groupe non trouvé'
      });
    }
    
    // Retirer le groupe de tous les contacts associés
    await Contact.updateMany(
      { groups: req.params.id },
      { $pull: { groups: req.params.id } }
    );
    
    await group.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Obtenir tous les contacts d'un groupe
 * @route   GET /api/groups/:id/contacts
 * @access  Public
 */
exports.getGroupContacts = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Groupe non trouvé'
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const contacts = await Contact.find({ groups: req.params.id })
      .skip(startIndex)
      .limit(limit)
      .sort({ lastName: 1, firstName: 1 });
    
    const total = await Contact.countDocuments({ groups: req.params.id });
    
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
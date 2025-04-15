const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Veuillez fournir une adresse email valide'
    ],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  birthDate: {
    type: Date
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  notes: {
    type: String
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware pour mettre à jour le champ updatedAt avant la sauvegarde
ContactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour formater le nom complet
ContactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Méthode pour rechercher des contacts
ContactSchema.statics.searchContacts = async function(searchTerm) {
  if (!searchTerm) {
    return this.find();
  }

  const regex = new RegExp(searchTerm, 'i');
  return this.find({
    $or: [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phoneNumber: regex },
      { address: regex },
      { notes: regex }
    ]
  });
};

module.exports = mongoose.model('Contact', ContactSchema);
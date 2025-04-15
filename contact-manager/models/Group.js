const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du groupe est requis'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#007bff',
    trim: true
  },
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
GroupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtuel pour les contacts associés au groupe
GroupSchema.virtual('contacts', {
  ref: 'Contact',
  localField: '_id',
  foreignField: 'groups',
  justOne: false
});

// Méthode pour obtenir le nombre de contacts dans le groupe
GroupSchema.methods.getContactCount = async function() {
  const Contact = mongoose.model('Contact');
  return await Contact.countDocuments({ groups: this._id });
};

module.exports = mongoose.model('Group', GroupSchema);
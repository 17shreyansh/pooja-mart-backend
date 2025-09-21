const mongoose = require('mongoose');

const poojaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  collections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoojaCollection'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

poojaSchema.index({ title: 1, category: 1, isActive: 1 });

module.exports = mongoose.model('Pooja', poojaSchema);
const mongoose = require('mongoose');

const poojaCollectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle1: {
    type: String,
    required: true,
    trim: true
  },
  subtitle2: {
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

poojaCollectionSchema.index({ title: 1, category: 1, isActive: 1 });

module.exports = mongoose.model('PoojaCollection', poojaCollectionSchema);
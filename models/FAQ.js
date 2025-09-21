const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  entityType: {
    type: String,
    enum: ['general', 'pooja', 'service', 'collection'],
    default: 'general'
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'entityModel'
  },
  entityModel: {
    type: String,
    enum: ['Pooja', 'Service', 'PoojaCollection']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

faqSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('FAQ', faqSchema);
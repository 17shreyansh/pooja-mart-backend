const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
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
  image: {
    type: String,
    required: true
  },
  offerType: {
    type: String,
    required: true,
    enum: ['pooja', 'service', 'collection'],
    lowercase: true
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  offerCode: {
    type: String,
    trim: true
  },
  buttonText: {
    type: String,
    default: 'Book Now'
  },
  buttonLink: {
    type: String,
    default: '/contact'
  },
  showInSlider: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for active offers
offerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Offer', offerSchema);
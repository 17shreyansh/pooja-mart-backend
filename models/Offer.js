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
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  offerCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  showInSlider: {
    type: Boolean,
    default: true
  },
  showInPopup: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0
  },
  buttonText: {
    type: String,
    default: 'Book Now'
  },
  buttonLink: {
    type: String,
    default: '/services'
  }
}, {
  timestamps: true
});

// Index for active offers
offerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Offer', offerSchema);
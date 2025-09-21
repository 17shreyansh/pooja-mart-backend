const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    enum: ['hero', 'howItWorks', 'cta']
  },
  content: {
    // Hero Section
    title: String,
    description: String,
    phone: String,
    backgroundImage: String,
    bannerImage: String,
    
    // How It Works Section
    heading: String,
    steps: [{
      number: String,
      title: String,
      description: String,
      image: String
    }],
    buttons: [String],
    
    // CTA Section
    ctaTitle: String,
    ctaButtonText: String,
    ctaBackgroundImage: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomePage', homePageSchema);
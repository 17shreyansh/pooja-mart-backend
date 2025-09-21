const mongoose = require('mongoose');

const poojaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
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
  faqs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FAQ'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
poojaSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

poojaSchema.index({ title: 1, category: 1, isActive: 1 });

module.exports = mongoose.model('Pooja', poojaSchema);
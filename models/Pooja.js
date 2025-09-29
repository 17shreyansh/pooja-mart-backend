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
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  showcaseImages: [{
    type: String,
    trim: true
  }],
  packages: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    duration: {
      type: String,
      trim: true
    },
    includes: [{
      type: String,
      trim: true
    }],
    collections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PoojaCollection'
    }]
  }],
  faqs: [{
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
    }
  }],
  cities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
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

poojaSchema.index({ title: 1, service: 1, isActive: 1 });

module.exports = mongoose.model('Pooja', poojaSchema);
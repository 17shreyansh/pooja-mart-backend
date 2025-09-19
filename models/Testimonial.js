const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  testimonial: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
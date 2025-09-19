const express = require('express');
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create testimonial
router.post('/', auth, async (req, res) => {
  try {
    const { testimonial, author } = req.body;
    const newTestimonial = new Testimonial({ testimonial, author });
    await newTestimonial.save();
    
    res.status(201).json({ success: true, data: newTestimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update testimonial
router.put('/:id', auth, async (req, res) => {
  try {
    const { testimonial, author } = req.body;
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id, 
      { testimonial, author }, 
      { new: true }
    );
    res.json({ success: true, data: updatedTestimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete testimonial
router.delete('/:id', auth, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
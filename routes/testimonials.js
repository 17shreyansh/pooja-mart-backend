const express = require('express');
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');
const router = express.Router();

// Get testimonials (public - only approved, optionally filtered by service)
router.get('/', async (req, res) => {
  try {
    const { service } = req.query;
    const filter = { isApproved: true };
    
    if (service) {
      filter.service = service;
    }
    
    const testimonials = await Testimonial.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all testimonials (admin - all)
router.get('/admin', auth, async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create testimonial (requires user auth)
router.post('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Please login to write a review' });
    }
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    const { testimonial, service, rating } = req.body;
    
    if (!testimonial || !service || !rating) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const newTestimonial = new Testimonial({ 
      testimonial, 
      service, 
      rating: Number(rating),
      user: userId
    });
    await newTestimonial.save();
    
    const populatedTestimonial = await Testimonial.findById(newTestimonial._id).populate('user', 'name');
    
    res.status(201).json({ success: true, data: populatedTestimonial, message: 'Review submitted successfully' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Please login to write a review' });
    }
    console.error('Testimonial creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update testimonial (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { testimonial, service, rating, isApproved } = req.body;
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id, 
      { testimonial, service, rating, isApproved }, 
      { new: true }
    ).populate('user', 'name email');
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
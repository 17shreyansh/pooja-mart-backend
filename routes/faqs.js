const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const auth = require('../middleware/auth');

// Get all FAQs (public)
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQs',
      error: error.message
    });
  }
});

// Get all FAQs (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQs',
      error: error.message
    });
  }
});

// Create FAQ (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    
    const faq = new FAQ({
      question,
      answer,
      order: order || 0
    });

    await faq.save();
    
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating FAQ',
      error: error.message
    });
  }
});

// Update FAQ (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { question, answer, order, isActive } = req.body;
    
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer, order, isActive },
      { new: true, runValidators: true }
    );
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    res.json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating FAQ',
      error: error.message
    });
  }
});

// Delete FAQ (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    res.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting FAQ',
      error: error.message
    });
  }
});

module.exports = router;
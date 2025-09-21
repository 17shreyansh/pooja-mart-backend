const express = require('express');
const router = express.Router();
const HomePage = require('../models/HomePage');
const auth = require('../middleware/auth');

// Get home page content (public)
router.get('/', async (req, res) => {
  try {
    const sections = await HomePage.find({ isActive: true });
    const content = {};
    
    sections.forEach(section => {
      content[section.section] = section.content;
    });
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home page content',
      error: error.message
    });
  }
});

// Get specific section (admin)
router.get('/:section', auth, async (req, res) => {
  try {
    const section = await HomePage.findOne({ section: req.params.section });
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }
    
    res.json({
      success: true,
      data: section
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching section',
      error: error.message
    });
  }
});

// Update home page section (admin)
router.put('/:section', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    const section = await HomePage.findOneAndUpdate(
      { section: req.params.section },
      { content },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Section updated successfully',
      data: section
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating section',
      error: error.message
    });
  }
});

module.exports = router;
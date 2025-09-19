const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const auth = require('../middleware/auth');

// Get page by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isActive: true });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    res.json({
      success: true,
      data: page
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching page',
      error: error.message
    });
  }
});

// Get all pages (admin)
router.get('/', auth, async (req, res) => {
  try {
    const pages = await Page.find().sort({ title: 1 });
    res.json({
      success: true,
      data: pages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pages',
      error: error.message
    });
  }
});

// Create/Update page (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { slug, title, content, isActive } = req.body;
    
    const existingPage = await Page.findOne({ slug });
    
    if (existingPage) {
      existingPage.title = title;
      existingPage.content = content;
      existingPage.isActive = isActive !== undefined ? isActive : existingPage.isActive;
      await existingPage.save();
      
      res.json({
        success: true,
        message: 'Page updated successfully',
        data: existingPage
      });
    } else {
      const page = new Page({ slug, title, content, isActive });
      await page.save();
      
      res.status(201).json({
        success: true,
        message: 'Page created successfully',
        data: page
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error saving page',
      error: error.message
    });
  }
});

// Update page (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, isActive } = req.body;
    
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { title, content, isActive },
      { new: true, runValidators: true }
    );
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Page updated successfully',
      data: page
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating page',
      error: error.message
    });
  }
});

module.exports = router;
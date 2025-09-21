const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const auth = require('../middleware/auth');

// Get all FAQs (public)
router.get('/', async (req, res) => {
  try {
    const { entityType, entityId } = req.query;
    const filter = { isActive: true };
    
    if (entityType && entityId) {
      filter.entityType = entityType;
      filter.entityId = entityId;
    } else if (entityType) {
      filter.entityType = entityType;
    }
    
    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: 1 });
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
    const { question, answer, order, entityType, entityId, entityModel } = req.body;
    
    const faq = new FAQ({
      question,
      answer,
      order: order || 0,
      entityType: entityType || 'general',
      entityId,
      entityModel
    });

    await faq.save();
    
    // If FAQ is linked to an entity, add it to the entity's FAQ array
    if (entityId && entityModel) {
      const Model = require(`../models/${entityModel}`);
      await Model.findByIdAndUpdate(entityId, {
        $addToSet: { faqs: faq._id }
      });
    }
    
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
    const { question, answer, order, isActive, entityType, entityId, entityModel } = req.body;
    
    const oldFaq = await FAQ.findById(req.params.id);
    if (!oldFaq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer, order, isActive, entityType, entityId, entityModel },
      { new: true, runValidators: true }
    );
    
    // Handle entity reference changes
    if (oldFaq.entityId && oldFaq.entityModel) {
      const OldModel = require(`../models/${oldFaq.entityModel}`);
      await OldModel.findByIdAndUpdate(oldFaq.entityId, {
        $pull: { faqs: faq._id }
      });
    }
    
    if (entityId && entityModel) {
      const NewModel = require(`../models/${entityModel}`);
      await NewModel.findByIdAndUpdate(entityId, {
        $addToSet: { faqs: faq._id }
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
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    // Remove FAQ reference from entity
    if (faq.entityId && faq.entityModel) {
      const Model = require(`../models/${faq.entityModel}`);
      await Model.findByIdAndUpdate(faq.entityId, {
        $pull: { faqs: faq._id }
      });
    }
    
    await FAQ.findByIdAndDelete(req.params.id);
    
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
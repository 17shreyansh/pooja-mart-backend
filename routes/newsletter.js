const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const auth = require('../middleware/auth');

// Subscribe to newsletter (public)
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Email already subscribed'
        });
      } else {
        existingSubscription.isActive = true;
        await existingSubscription.save();
        return res.json({
          success: true,
          message: 'Successfully resubscribed to newsletter'
        });
      }
    }
    
    const newsletter = new Newsletter({ email });
    await newsletter.save();
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error subscribing to newsletter',
      error: error.message
    });
  }
});

// Get all subscribers (admin)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, active } = req.query;
    const filter = {};
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    const subscribers = await Newsletter.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Newsletter.countDocuments(filter);
    
    res.json({
      success: true,
      data: subscribers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers',
      error: error.message
    });
  }
});

// Export subscribers (admin)
router.get('/export', auth, async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    const subscribers = await Newsletter.find(filter).sort({ createdAt: -1 });
    
    // Create CSV content
    const csvHeader = 'Email,Subscribed Date,Status\n';
    const csvContent = subscribers.map(sub => 
      `${sub.email},${sub.createdAt.toISOString().split('T')[0]},${sub.isActive ? 'Active' : 'Inactive'}`
    ).join('\n');
    
    const csv = csvHeader + csvContent;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=newsletter-subscribers.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting subscribers',
      error: error.message
    });
  }
});

// Update subscriber status (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const subscriber = await Newsletter.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Subscriber updated successfully',
      data: subscriber
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating subscriber',
      error: error.message
    });
  }
});

// Delete subscriber (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subscriber',
      error: error.message
    });
  }
});

module.exports = router;
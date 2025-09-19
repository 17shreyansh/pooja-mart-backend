const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

// Create new lead (public route)
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message, serviceType, serviceName, city } = req.body;
    
    const lead = new Lead({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      serviceType,
      serviceName,
      city
    });

    await lead.save();
    
    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating lead',
      error: error.message
    });
  }
});

// Get all leads (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Lead.countDocuments(filter);
    
    res.json({
      success: true,
      data: leads,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: leads.length,
        totalRecords: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leads',
      error: error.message
    });
  }
});

// Get lead by ID (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lead',
      error: error.message
    });
  }
});

// Update lead (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, priority, notes } = req.body;
    
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status, priority, notes },
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating lead',
      error: error.message
    });
  }
});

// Delete lead (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lead',
      error: error.message
    });
  }
});

// Get lead statistics (admin only)
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'qualified' });
    const convertedLeads = await Lead.countDocuments({ status: 'converted' });
    
    const leadsByType = await Lead.aggregate([
      { $group: { _id: '$serviceType', count: { $sum: 1 } } }
    ]);
    
    const leadsByMonth = await Lead.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        qualifiedLeads,
        convertedLeads,
        conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0,
        leadsByType,
        leadsByMonth
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lead statistics',
      error: error.message
    });
  }
});

module.exports = router;
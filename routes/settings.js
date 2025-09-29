const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// Get WhatsApp settings
router.get('/whatsapp', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'whatsapp_number' });
    res.json({
      success: true,
      data: setting ? setting.value : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching WhatsApp settings',
      error: error.message
    });
  }
});

// Update WhatsApp settings (Admin only)
router.put('/whatsapp', auth, async (req, res) => {
  try {
    const { whatsappNumber } = req.body;
    
    const setting = await Settings.findOneAndUpdate(
      { key: 'whatsapp_number' },
      { 
        key: 'whatsapp_number',
        value: whatsappNumber,
        description: 'WhatsApp number for inquiry button'
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'WhatsApp settings updated successfully',
      data: setting.value
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating WhatsApp settings',
      error: error.message
    });
  }
});

module.exports = router;
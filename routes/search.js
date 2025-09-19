const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Pooja = require('../models/Pooja');
const PoojaCollection = require('../models/PoojaCollection');

// Global search endpoint
router.get('/', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: {
          services: [],
          poojas: [],
          products: [],
          suggestions: []
        }
      });
    }

    const searchRegex = { $regex: q, $options: 'i' };
    const searchFilter = {
      $or: [
        { title: searchRegex },
        { subtitle: searchRegex },
        { category: searchRegex }
      ],
      isActive: true
    };

    const productSearchFilter = {
      $or: [
        { title: searchRegex },
        { subtitle1: searchRegex },
        { subtitle2: searchRegex },
        { category: searchRegex }
      ],
      isActive: true
    };

    const [services, poojas, products] = await Promise.all([
      Service.find(searchFilter).limit(parseInt(limit)).select('title subtitle category image'),
      Pooja.find(searchFilter).limit(parseInt(limit)).select('title subtitle category image'),
      PoojaCollection.find(productSearchFilter).limit(parseInt(limit)).select('title subtitle1 subtitle2 category image')
    ]);

    // Create suggestions from all results
    const suggestions = [
      ...services.map(s => ({ text: s.title, type: 'service', category: s.category })),
      ...poojas.map(p => ({ text: p.title, type: 'pooja', category: p.category })),
      ...products.map(p => ({ text: p.title, type: 'product', category: p.category }))
    ].slice(0, 8);

    res.json({
      success: true,
      data: {
        services: services.map(s => ({ ...s.toObject(), type: 'service' })),
        poojas: poojas.map(p => ({ ...p.toObject(), type: 'pooja' })),
        products: products.map(p => ({ ...p.toObject(), type: 'product' })),
        suggestions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [serviceCategories, poojaCategories, productCategories] = await Promise.all([
      Service.distinct('category', { isActive: true }),
      Pooja.distinct('category', { isActive: true }),
      PoojaCollection.distinct('category', { isActive: true })
    ]);

    res.json({
      success: true,
      data: {
        services: serviceCategories,
        poojas: poojaCategories,
        products: productCategories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

module.exports = router;
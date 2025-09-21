const mongoose = require('mongoose');
const Pooja = require('../models/Pooja');
require('dotenv').config();

const updateSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const poojas = await Pooja.find({});
    
    for (const pooja of poojas) {
      if (!pooja.slug) {
        pooja.slug = pooja.title.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
        
        await pooja.save();
        console.log(`Updated slug for: ${pooja.title} -> ${pooja.slug}`);
      }
    }
    
    console.log('Pooja slug update completed');
    process.exit(0);
  } catch (error) {
    console.error('Error updating slugs:', error);
    process.exit(1);
  }
};

updateSlugs();
const mongoose = require('mongoose');
const PoojaCollection = require('../models/PoojaCollection');
require('dotenv').config();

const updateSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const collections = await PoojaCollection.find({});
    
    for (const collection of collections) {
      if (!collection.slug) {
        collection.slug = collection.title.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
        
        await collection.save();
        console.log(`Updated slug for: ${collection.title} -> ${collection.slug}`);
      }
    }
    
    console.log('Slug update completed');
    process.exit(0);
  } catch (error) {
    console.error('Error updating slugs:', error);
    process.exit(1);
  }
};

updateSlugs();
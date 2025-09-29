const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Service = require('./models/Service');
const Pooja = require('./models/Pooja');
const Category = require('./models/Category');

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Step 1: Get all existing categories to convert to services
    const categories = await Category.find();
    console.log(`Found ${categories.length} categories to migrate`);

    // Step 2: Create services from categories
    for (const category of categories) {
      const existingService = await Service.findOne({ name: category.name });
      if (!existingService) {
        const service = new Service({
          name: category.name,
          description: category.description,
          image: category.image,
          isActive: category.isActive
        });
        await service.save();
        console.log(`Created service: ${service.name}`);
      }
    }

    // Step 3: Update all poojas to reference services instead of categories
    const poojas = await Pooja.find().populate('category');
    console.log(`Found ${poojas.length} poojas to update`);

    for (const pooja of poojas) {
      if (pooja.category) {
        // Find the corresponding service
        const service = await Service.findOne({ name: pooja.category.name });
        if (service) {
          // Update pooja to reference service instead of category
          await Pooja.findByIdAndUpdate(pooja._id, {
            $set: { service: service._id },
            $unset: { 
              category: 1,
              services: 1  // Remove old services array
            }
          });
          console.log(`Updated pooja: ${pooja.title} -> Service: ${service.name}`);
        }
      }
    }

    // Step 4: Clean up old services that had category references
    await Service.updateMany(
      {},
      {
        $unset: {
          category: 1,
          price: 1,
          faqs: 1
        }
      }
    );

    console.log('Migration completed successfully!');
    console.log('\nSummary:');
    console.log(`- Converted ${categories.length} categories to services`);
    console.log(`- Updated ${poojas.length} poojas to reference services`);
    console.log('- Cleaned up old service fields');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run migration
migrate();
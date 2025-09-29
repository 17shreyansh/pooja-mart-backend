const mongoose = require('mongoose');
require('dotenv').config();

const City = require('./models/City');
const Service = require('./models/Service');
const Pooja = require('./models/Pooja');
const PoojaCollection = require('./models/PoojaCollection');
const Category = require('./models/Category');
const Admin = require('./models/Admin');

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await City.deleteMany({});
    await Service.deleteMany({});
    await Pooja.deleteMany({});
    await PoojaCollection.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Seed Cities
    const cities = await City.create([
      { name: 'Mumbai', state: 'Maharashtra', isActive: true },
      { name: 'Delhi', state: 'Delhi', isActive: true },
      { name: 'Bangalore', state: 'Karnataka', isActive: true },
      { name: 'Hyderabad', state: 'Telangana', isActive: true },
      { name: 'Chennai', state: 'Tamil Nadu', isActive: true },
      { name: 'Kolkata', state: 'West Bengal', isActive: true },
      { name: 'Pune', state: 'Maharashtra', isActive: true },
      { name: 'Ahmedabad', state: 'Gujarat', isActive: true },
      { name: 'Jaipur', state: 'Rajasthan', isActive: true },
      { name: 'Surat', state: 'Gujarat', isActive: true }
    ]);

    console.log('Created cities:', cities.length);

    // Create Categories
    const categories = await Category.create([
      {
        name: 'Pooja Items',
        description: 'Essential items for pooja ceremonies',
        isActive: true
      },
      {
        name: 'Decorative Items',
        description: 'Decorative items for ceremonies',
        isActive: true
      },
      {
        name: 'Consumables',
        description: 'Consumable items for rituals',
        isActive: true
      }
    ]);

    console.log('Created categories:', categories.length);

    // Create Services
    const services = await Service.create([
      {
        name: 'Wedding Ceremonies',
        description: 'Complete wedding rituals and ceremonies for your special day',
        image: '/uploads/wedding-service.jpg',
        isActive: true
      },
      {
        name: 'Housewarming Poojas',
        description: 'Bless your new home with traditional housewarming ceremonies',
        image: '/uploads/housewarming-service.jpg',
        isActive: true
      },
      {
        name: 'Festival Celebrations',
        description: 'Traditional festival poojas and celebrations',
        image: '/uploads/festival-service.jpg',
        isActive: true
      },
      {
        name: 'Health & Wellness',
        description: 'Poojas for health, healing and well-being',
        image: '/uploads/health-service.jpg',
        isActive: true
      },
      {
        name: 'Business & Career',
        description: 'Poojas for business success and career growth',
        image: '/uploads/business-service.jpg',
        isActive: true
      }
    ]);

    console.log('Created services:', services.length);

    // Create Pooja Collections
    const collections = await PoojaCollection.create([
      {
        title: 'Sacred Kalash Set',
        description: 'Traditional brass kalash with coconut and mango leaves',
        category: categories[0]._id,
        price: 299,
        stock: 50,
        image: '/uploads/kalash-set.jpg',
        isActive: true
      },
      {
        title: 'Pooja Thali Complete',
        description: 'Complete brass pooja thali with all essentials',
        category: categories[0]._id,
        price: 599,
        stock: 30,
        image: '/uploads/pooja-thali.jpg',
        isActive: true
      },
      {
        title: 'Incense & Camphor Set',
        description: 'Premium incense sticks and pure camphor',
        category: categories[2]._id,
        price: 199,
        stock: 100,
        image: '/uploads/incense-set.jpg',
        isActive: true
      },
      {
        title: 'Fresh Flower Garlands',
        description: 'Fresh marigold and rose garlands',
        category: categories[1]._id,
        price: 149,
        stock: 25,
        image: '/uploads/flower-garlands.jpg',
        isActive: true
      },
      {
        title: 'Sacred Thread & Tilak',
        description: 'Janeu, kalava and tilak materials',
        category: categories[0]._id,
        price: 99,
        stock: 75,
        image: '/uploads/sacred-thread.jpg',
        isActive: true
      }
    ]);

    console.log('Created collections:', collections.length);

    // Create Sample Poojas
    const poojas = await Pooja.create([
      {
        title: 'Ganesh Chaturthi Celebration',
        description: 'Complete Ganesh Chaturthi pooja with traditional rituals and offerings',
        service: services[2]._id,
        cities: [cities[0]._id, cities[1]._id, cities[2]._id],
        image: '/uploads/ganesh-pooja.jpg',
        packages: [
          {
            name: 'Basic Package',
            description: 'Essential Ganesh pooja with basic rituals',
            price: 1500,
            duration: '2 hours',
            includes: ['Ganesh idol placement', 'Basic aarti', 'Prasad distribution'],
            collections: [collections[0]._id, collections[2]._id]
          },
          {
            name: 'Premium Package',
            description: 'Complete Ganesh celebration with elaborate rituals',
            price: 3500,
            duration: '4 hours',
            includes: ['Elaborate rituals', 'Modak preparation', 'Cultural program', 'Photography'],
            collections: [collections[0]._id, collections[1]._id, collections[2]._id, collections[3]._id]
          }
        ],
        faqs: [
          {
            question: 'What is included in the Ganesh pooja?',
            answer: 'The pooja includes idol installation, traditional rituals, aarti, and prasad distribution.',
            order: 1
          }
        ],
        isActive: true
      },
      {
        title: 'Griha Pravesh Ceremony',
        description: 'Traditional housewarming ceremony to bless your new home',
        service: services[1]._id,
        cities: [cities[0]._id, cities[2]._id, cities[4]._id],
        image: '/uploads/griha-pravesh.jpg',
        packages: [
          {
            name: 'Standard Package',
            description: 'Complete housewarming ceremony with Vastu pooja',
            price: 2500,
            duration: '3 hours',
            includes: ['Vastu pooja', 'Kalash sthapana', 'Havan ceremony', 'Aarti'],
            collections: [collections[0]._id, collections[1]._id, collections[4]._id]
          }
        ],
        faqs: [
          {
            question: 'When should we perform Griha Pravesh?',
            answer: 'Griha Pravesh should be performed on an auspicious day before moving into the new house.',
            order: 1
          }
        ],
        isActive: true
      }
    ]);

    console.log('Created poojas:', poojas.length);

    // Create admin user if doesn't exist
    const existingAdmin = await Admin.findOne({ email: 'admin@pujamart.com' });
    if (!existingAdmin) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await Admin.create({
        name: 'Admin',
        email: 'admin@pujamart.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Created admin user');
    }

    console.log('✅ All data seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Cities: ${cities.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Collections: ${collections.length}`);
    console.log(`   - Poojas: ${poojas.length}`);
    console.log(`   - Admin user: admin@pujamart.com / admin123`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedAll();
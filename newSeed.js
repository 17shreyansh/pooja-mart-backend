const mongoose = require('mongoose');
require('dotenv').config();

const Service = require('./models/Service');
const Pooja = require('./models/Pooja');
const PoojaCollection = require('./models/PoojaCollection');
const Admin = require('./models/Admin');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    await Pooja.deleteMany({});
    await PoojaCollection.deleteMany({});
    console.log('Cleared existing data');

    // Create Services (Categories)
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

    // Create Categories first
    const Category = require('./models/Category');
    await Category.deleteMany({});
    
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

    // Create Poojas with Packages
    const poojas = await Pooja.create([
      {
        title: 'Ganesh Chaturthi Celebration',
        description: 'Complete Ganesh Chaturthi pooja with traditional rituals and offerings',
        service: services[2]._id, // Festival Celebrations
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
        service: services[1]._id, // Housewarming Poojas
        image: '/uploads/griha-pravesh.jpg',
        packages: [
          {
            name: 'Standard Package',
            description: 'Complete housewarming ceremony with Vastu pooja',
            price: 2500,
            duration: '3 hours',
            includes: ['Vastu pooja', 'Kalash sthapana', 'Havan ceremony', 'Aarti'],
            collections: [collections[0]._id, collections[1]._id, collections[4]._id]
          },
          {
            name: 'Deluxe Package',
            description: 'Elaborate housewarming with multiple rituals',
            price: 5000,
            duration: '5 hours',
            includes: ['Complete Vastu correction', 'Multiple havans', 'Feast arrangement', 'Priest consultation'],
            collections: [collections[0]._id, collections[1]._id, collections[2]._id, collections[3]._id, collections[4]._id]
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
      },
      {
        title: 'Wedding Ceremony Complete',
        description: 'Traditional Hindu wedding ceremony with all rituals',
        service: services[0]._id, // Wedding Ceremonies
        image: '/uploads/wedding-ceremony.jpg',
        packages: [
          {
            name: 'Essential Wedding',
            description: 'Core wedding rituals and ceremonies',
            price: 15000,
            duration: '6 hours',
            includes: ['Mandap setup', 'Pandit services', 'Essential rituals', 'Photography'],
            collections: [collections[0]._id, collections[1]._id, collections[3]._id, collections[4]._id]
          },
          {
            name: 'Royal Wedding',
            description: 'Complete traditional wedding with all ceremonies',
            price: 35000,
            duration: '2 days',
            includes: ['Pre-wedding ceremonies', 'Elaborate mandap', 'Multiple pandits', 'Feast', 'Music', 'Decoration'],
            collections: [collections[0]._id, collections[1]._id, collections[2]._id, collections[3]._id, collections[4]._id]
          }
        ],
        faqs: [
          {
            question: 'What ceremonies are included in the wedding package?',
            answer: 'The package includes Haldi, Mehendi, Sangam, Pheras, and other traditional ceremonies.',
            order: 1
          }
        ],
        isActive: true
      },
      {
        title: 'Mahamrityunjaya Jaap',
        description: 'Powerful healing mantra chanting for health and longevity',
        service: services[3]._id, // Health & Wellness
        image: '/uploads/mahamrityunjaya.jpg',
        packages: [
          {
            name: '108 Jaap',
            description: 'Basic 108 times chanting of Mahamrityunjaya mantra',
            price: 1100,
            duration: '1 hour',
            includes: ['108 mantra chanting', 'Abhishek', 'Prasad'],
            collections: [collections[0]._id, collections[2]._id]
          },
          {
            name: '1008 Jaap',
            description: 'Powerful 1008 times chanting for serious health issues',
            price: 5100,
            duration: '4 hours',
            includes: ['1008 mantra chanting', 'Special abhishek', 'Havan', 'Prasad', 'Rudraksha blessing'],
            collections: [collections[0]._id, collections[1]._id, collections[2]._id, collections[4]._id]
          }
        ],
        faqs: [
          {
            question: 'What are the benefits of Mahamrityunjaya Jaap?',
            answer: 'This powerful mantra helps in healing, protection from diseases, and promotes longevity.',
            order: 1
          }
        ],
        isActive: true
      },
      {
        title: 'Lakshmi Pooja for Prosperity',
        description: 'Invoke Goddess Lakshmi for wealth and business success',
        service: services[4]._id, // Business & Career
        image: '/uploads/lakshmi-pooja.jpg',
        packages: [
          {
            name: 'Business Blessing',
            description: 'Special Lakshmi pooja for business prosperity',
            price: 2100,
            duration: '2 hours',
            includes: ['Lakshmi idol worship', 'Business blessing', 'Prosperity mantras', 'Prasad'],
            collections: [collections[0]._id, collections[1]._id, collections[3]._id]
          },
          {
            name: 'Wealth Attraction',
            description: 'Elaborate ceremony to attract wealth and remove financial obstacles',
            price: 5100,
            duration: '4 hours',
            includes: ['Elaborate Lakshmi pooja', 'Kubera worship', 'Wealth mantras', 'Yantra installation', 'Business consultation'],
            collections: [collections[0]._id, collections[1]._id, collections[2]._id, collections[3]._id, collections[4]._id]
          }
        ],
        faqs: [
          {
            question: 'When is the best time for Lakshmi pooja?',
            answer: 'Friday evenings and during Diwali are considered most auspicious for Lakshmi pooja.',
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

    console.log('✅ Seed data created successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Categories: ${categories.length}`);
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

seedData();
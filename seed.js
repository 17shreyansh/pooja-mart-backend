const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Service = require('./models/Service');
const PoojaCollection = require('./models/PoojaCollection');
const Pooja = require('./models/Pooja');
const HomePage = require('./models/HomePage');
const Offer = require('./models/Offer');
const Page = require('./models/Page');
const FAQ = require('./models/FAQ');
const Testimonial = require('./models/Testimonial');
const User = require('./models/User');

const seedAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    // Clear all existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Category.deleteMany({}),
      Service.deleteMany({}),
      PoojaCollection.deleteMany({}),
      Pooja.deleteMany({}),
      HomePage.deleteMany({}),
      Offer.deleteMany({}),
      Page.deleteMany({}),
      FAQ.deleteMany({}),
      Testimonial.deleteMany({}),
      User.deleteMany({})
    ]);

    // 1. Create Categories
    console.log('📂 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Festival',
        description: 'Festival celebrations and special occasion poojas',
        image: '/uploads/category-festival.jpg'
      },
      {
        name: 'Special Occasion',
        description: 'Special life events and milestone celebrations',
        image: '/uploads/category-special.jpg'
      },
      {
        name: 'Daily Worship',
        description: 'Daily pooja and worship essentials',
        image: '/uploads/category-daily.jpg'
      },
      {
        name: 'Priest Services',
        description: 'Experienced pandit services for all ceremonies',
        image: '/uploads/category-priest.jpg'
      },
      {
        name: 'Decoration',
        description: 'Traditional decoration services for festivals',
        image: '/uploads/category-decoration.jpg'
      },
      {
        name: 'Catering',
        description: 'Vegetarian catering for religious ceremonies',
        image: '/uploads/category-catering.jpg'
      },
      {
        name: 'Photography',
        description: 'Professional photography for religious events',
        image: '/uploads/category-photography.jpg'
      },
      {
        name: 'Festival Kits',
        description: 'Complete festival celebration packages',
        image: '/uploads/category-kits.jpg'
      }
    ]);

    // 2. Create Services
    console.log('🛎️ Creating services...');
    const services = await Service.insertMany([
      {
        title: 'Experienced Pandit Service',
        description: 'Highly experienced and knowledgeable pandits for all types of religious ceremonies and poojas. Well-versed in Sanskrit mantras and traditional rituals.',
        category: categories.find(c => c.name === 'Priest Services')._id,
        price: 1500,
        image: '/uploads/pandit-service.jpg'
      },
      {
        title: 'Home Decoration Service',
        description: 'Professional decoration service for your home during festivals and special occasions. Includes rangoli, flower arrangements, and traditional decorations.',
        category: categories.find(c => c.name === 'Decoration')._id,
        price: 800,
        image: '/uploads/decoration.jpg'
      },
      {
        title: 'Catering Service',
        description: 'Traditional vegetarian catering service for religious ceremonies. Includes prasadam preparation and serving arrangements.',
        category: categories.find(c => c.name === 'Catering')._id,
        price: 2000,
        image: '/uploads/catering.jpg'
      },
      {
        title: 'Photography Service',
        description: 'Professional photography and videography service to capture your special religious moments and ceremonies.',
        category: categories.find(c => c.name === 'Photography')._id,
        price: 1200,
        image: '/uploads/photography.jpg'
      }
    ]);

    // 3. Create Collections
    console.log('📦 Creating collections...');
    const collections = await PoojaCollection.insertMany([
      {
        title: 'Ganesh Chaturthi Complete Kit',
        description: 'Everything you need for a perfect Ganesh Chaturthi celebration at home. Includes eco-friendly idol and all essential pooja items.',
        category: categories.find(c => c.name === 'Festival Kits')._id,
        price: 850,
        stock: 25,
        attributes: [
          { name: 'Weight', value: '2.5 kg' },
          { name: 'Material', value: 'Eco-friendly clay' },
          { name: 'Size', value: 'Medium (8 inches)' },
          { name: 'Includes', value: 'Ganesh Idol, Pooja Thali, Modak Mould, Flowers' }
        ],
        image: '/uploads/ganesh-kit.jpg'
      },
      {
        title: 'Diwali Celebration Package',
        description: 'Complete Diwali celebration package with diyas, rangoli materials, and festive decorations for your home.',
        category: categories.find(c => c.name === 'Festival Kits')._id,
        price: 1200,
        stock: 15,
        attributes: [
          { name: 'Items Count', value: '50+ pieces' },
          { name: 'Light Type', value: 'LED (Safe)' },
          { name: 'Duration', value: 'Lasts 5 days' },
          { name: 'Includes', value: 'Clay Diyas, Rangoli Colors, LED Lights, Lakshmi Idol' }
        ],
        image: '/uploads/diwali-kit.jpg'
      },
      {
        title: 'Daily Pooja Essentials',
        description: 'Essential items for daily worship and prayers. Perfect for regular home pooja rituals.',
        category: categories.find(c => c.name === 'Daily Worship')._id,
        price: 450,
        stock: 50,
        attributes: [
          { name: 'Usage', value: 'Daily worship' },
          { name: 'Purity', value: '100% Natural' },
          { name: 'Shelf Life', value: '6 months' },
          { name: 'Includes', value: 'Brass Diya, Incense Sticks, Camphor, Kumkum & Turmeric' }
        ],
        image: '/uploads/daily-pooja.jpg'
      }
    ]);

    // 4. Create Poojas
    console.log('🕉️ Creating poojas...');
    const poojas = await Pooja.insertMany([
      {
        title: 'Ganesh Chaturthi Celebration',
        description: 'Complete Ganesh Chaturthi celebration with traditional rituals, mantras, and ceremonies. Includes Ganesh sthapana, daily aarti, and visarjan ceremony.',
        category: categories.find(c => c.name === 'Festival')._id,
        packages: [
          {
            name: 'Basic Package',
            description: 'Essential Ganesh Chaturthi celebration with pandit service and basic pooja items',
            services: [services[0]._id],
            collections: [collections[0]._id],
            price: 2350
          },
          {
            name: 'Premium Package',
            description: 'Complete celebration with decoration, catering, and photography',
            services: [services[0]._id, services[1]._id, services[2]._id, services[3]._id],
            collections: [collections[0]._id],
            price: 6350
          }
        ],
        image: '/uploads/ganesh-pooja.jpg'
      },
      {
        title: 'Lakshmi Pooja',
        description: 'Traditional Lakshmi pooja for prosperity and wealth. Perfect for Diwali or any auspicious occasion to invite goddess Lakshmi into your home.',
        category: categories.find(c => c.name === 'Festival')._id,
        packages: [
          {
            name: 'Standard Package',
            description: 'Traditional Lakshmi pooja with experienced pandit and Diwali essentials',
            services: [services[0]._id],
            collections: [collections[1]._id],
            price: 2700
          },
          {
            name: 'Deluxe Package',
            description: 'Complete Diwali celebration with decoration and catering',
            services: [services[0]._id, services[1]._id, services[2]._id],
            collections: [collections[1]._id],
            price: 5000
          }
        ],
        image: '/uploads/lakshmi-pooja.jpg'
      },
      {
        title: 'Griha Pravesh Pooja',
        description: 'Auspicious house warming ceremony to purify and bless your new home. Includes Vastu pooja and Ganesh sthapana for positive energy.',
        category: categories.find(c => c.name === 'Special Occasion')._id,
        packages: [
          {
            name: 'Essential Package',
            description: 'Basic griha pravesh rituals with pandit service',
            services: [services[0]._id],
            collections: [collections[2]._id],
            price: 1950
          },
          {
            name: 'Complete Package',
            description: 'Full ceremony with decoration and photography',
            services: [services[0]._id, services[1]._id, services[3]._id],
            collections: [collections[2]._id],
            price: 4450
          }
        ],
        image: '/uploads/griha-pravesh.jpg'
      },
      {
        title: 'Satyanarayan Pooja',
        description: 'Sacred Satyanarayan Katha and pooja for fulfillment of wishes and removal of obstacles. Includes prasadam preparation and distribution.',
        category: categories.find(c => c.name === 'Special Occasion')._id,
        packages: [
          {
            name: 'Traditional Package',
            description: 'Complete Satyanarayan pooja with katha and prasadam',
            services: [services[0]._id, services[2]._id],
            collections: [collections[2]._id],
            price: 3950
          }
        ],
        image: '/uploads/satyanarayan.jpg'
      },
      {
        title: 'Navratri Celebration',
        description: 'Nine-day Navratri celebration with daily aarti, bhajans, and special rituals for Goddess Durga. Includes all nine forms worship.',
        category: categories.find(c => c.name === 'Festival')._id,
        packages: [
          {
            name: 'Daily Aarti Package',
            description: 'Daily evening aarti for all 9 days of Navratri',
            services: [services[0]._id],
            collections: [collections[2]._id],
            price: 4500
          },
          {
            name: 'Grand Celebration',
            description: 'Complete Navratri with decoration, catering, and photography',
            services: [services[0]._id, services[1]._id, services[2]._id, services[3]._id],
            collections: [collections[2]._id],
            price: 12000
          }
        ],
        image: '/uploads/navratri.jpg'
      },
      {
        title: 'Karva Chauth Pooja',
        description: 'Traditional Karva Chauth fast and pooja for married women. Includes moon sighting ritual and fast-breaking ceremony.',
        category: categories.find(c => c.name === 'Special Occasion')._id,
        packages: [
          {
            name: 'Traditional Package',
            description: 'Complete Karva Chauth pooja with traditional rituals',
            services: [services[0]._id],
            collections: [collections[2]._id],
            price: 1950
          }
        ],
        image: '/uploads/karva-chauth.jpg'
      }
    ]);

    // 5. Create Home Page Data
    console.log('🏠 Creating home page data...');
    await HomePage.insertMany([
      {
        section: 'hero',
        content: {
          title: 'Pooja Samagri, Prasad & Pandit Ji – All at One Place',
          description: 'Complete Devotional Service at Your Doorstep – For Peace, Happiness & Prosperity',
          phone: '8929255775',
          backgroundImage: '/assets/hero-bg.jpg',
          bannerImage: '/assets/hero-1.png'
        }
      },
      {
        section: 'howItWorks',
        content: {
          heading: 'How It works',
          steps: [
            {
              number: '01',
              title: 'Select Pooja or Product',
              description: 'Browse and pick Pooja kits & items',
              image: '/assets/step1.png'
            },
            {
              number: '02',
              title: 'Customize & Book',
              description: 'Choose date, time & purpose (for pooja)',
              image: '/assets/step2.png'
            },
            {
              number: '03',
              title: 'Easy Payment',
              description: 'Secure online transactions',
              image: '/assets/step3.png'
            },
            {
              number: '04',
              title: 'Experience the Divine',
              description: 'Pandit Ji performs rituals or products reach home',
              image: '/assets/step4.png'
            }
          ],
          buttons: ['Get Prasad', 'Book Pandit ji', 'Order Pooja Kit', 'Vastu Consultation']
        }
      },
      {
        section: 'cta',
        content: {
          ctaTitle: 'Book Your Pooja. Shop Divine Essentials.',
          ctaButtonText: 'Book a Pooja',
          ctaBackgroundImage: '/assets/ctaBG.jpg'
        }
      }
    ]);

    // 6. Create Offers
    console.log('🎁 Creating offers...');
    await Offer.insertMany([
      {
        title: "Diwali Special - 50% Off All Poojas",
        description: "Celebrate the festival of lights with our special Diwali offer. Get 50% discount on all pooja services.",
        image: "/uploads/offer-1758554607992-838176224.jpg",
        discountPercentage: 50,
        offerCode: "DIWALI50",
        startDate: new Date('2024-10-15'),
        endDate: new Date('2024-11-15'),
        isActive: true,
        showInSlider: true,
        showInPopup: true,
        priority: 10,
        buttonText: "Book Diwali Pooja",
        buttonLink: "/services"
      },
      {
        title: "Navratri Celebration Package",
        description: "Special Navratri package with Durga Pooja and Aarti services. Limited time offer!",
        image: "/uploads/navratri-offer.jpg",
        discountPercentage: 30,
        offerCode: "NAVRATRI30",
        startDate: new Date('2024-09-15'),
        endDate: new Date('2024-10-24'),
        isActive: true,
        showInSlider: true,
        showInPopup: false,
        priority: 8,
        buttonText: "Book Navratri Package",
        buttonLink: "/services"
      },
      {
        title: "New Year Blessing - Early Bird Offer",
        description: "Start your new year with divine blessings. Book early and save 25% on all services.",
        image: "/uploads/newyear-offer.jpg",
        discountPercentage: 25,
        offerCode: "NEWYEAR25",
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-01-31'),
        isActive: true,
        showInSlider: true,
        showInPopup: false,
        priority: 5,
        buttonText: "Book New Year Pooja",
        buttonLink: "/services"
      }
    ]);

    // 7. Create Pages
    console.log('📄 Creating pages...');
    await Page.insertMany([
      {
        slug: 'return-refund-policy',
        title: 'Return and Refund Policy',
        content: `<h2>Return and Refund Policy</h2><p><strong>Effective Date:</strong> January 1, 2024</p><h3>Returns</h3><p>We accept returns within 7 days of delivery for unused pooja items in original packaging. Perishable items and customized poojas cannot be returned.</p><h3>Refund Process</h3><ul><li>Contact us within 7 days of delivery</li><li>Provide order number and reason for return</li><li>Return items in original condition</li><li>Refunds processed within 5-7 business days</li></ul><h3>Contact Us</h3><p>Email: returns@pujamart.com<br>Phone: +91 8929255775</p>`,
        isActive: true
      },
      {
        slug: 'terms-conditions',
        title: 'Terms and Conditions',
        content: `<h2>Terms and Conditions</h2><p><strong>Last Updated:</strong> January 1, 2024</p><h3>1. Acceptance of Terms</h3><p>By using our services, you agree to these terms and conditions.</p><h3>2. Services</h3><p>We provide pooja services, religious items, and spiritual guidance. Services are subject to availability and pandit schedules.</p><h3>3. Booking and Payment</h3><ul><li>Advance payment required for pooja bookings</li><li>Cancellations must be made 24 hours in advance</li><li>Rescheduling subject to pandit availability</li></ul><h3>Contact Information</h3><p>For questions about these terms, contact us at legal@pujamart.com</p>`,
        isActive: true
      },
      {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        content: `<h2>Privacy Policy</h2><p><strong>Effective Date:</strong> January 1, 2024</p><h3>Information We Collect</h3><ul><li>Personal information (name, email, phone)</li><li>Address for service delivery</li><li>Payment information (processed securely)</li><li>Service preferences and requirements</li></ul><h3>How We Use Your Information</h3><ul><li>Process and fulfill your orders</li><li>Communicate about services and bookings</li><li>Improve our services and customer experience</li><li>Send promotional offers (with consent)</li></ul><h3>Contact Us</h3><p>For privacy concerns, contact us at privacy@pujamart.com</p>`,
        isActive: true
      },
      {
        slug: 'shipping-policy',
        title: 'Shipping Policy',
        content: `<h2>Shipping Policy</h2><p><strong>Last Updated:</strong> January 1, 2024</p><h3>Delivery Areas</h3><p>We currently deliver to major cities across India. Check availability during checkout or contact us for specific locations.</p><h3>Delivery Times</h3><ul><li><strong>Pooja Items:</strong> 2-5 business days</li><li><strong>Fresh Items:</strong> Same day or next day delivery</li><li><strong>Pandit Services:</strong> As per scheduled appointment</li></ul><h3>Shipping Charges</h3><ul><li>Free delivery on orders above ₹500</li><li>Standard delivery: ₹50-100 depending on location</li><li>Express delivery: ₹150-200</li></ul><h3>Contact Information</h3><p>Shipping queries: shipping@pujamart.com<br>Phone: +91 8929255775</p>`,
        isActive: true
      }
    ]);

    // 8. Create FAQs
    console.log('❓ Creating FAQs...');
    await FAQ.insertMany([
      {
        question: 'How do I book a pooja service?',
        answer: 'You can book a pooja service by browsing our services, selecting your preferred package, choosing date and time, and completing the payment online.',
        category: 'Booking',
        isActive: true
      },
      {
        question: 'What areas do you serve?',
        answer: 'We currently serve major cities across India. Please check availability during checkout or contact us for specific locations.',
        category: 'Service Area',
        isActive: true
      },
      {
        question: 'Can I cancel or reschedule my booking?',
        answer: 'Yes, you can cancel or reschedule your booking up to 24 hours before the scheduled time. Cancellation and rescheduling policies apply.',
        category: 'Booking',
        isActive: true
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets for secure online payments.',
        category: 'Payment',
        isActive: true
      },
      {
        question: 'Do you provide all pooja materials?',
        answer: 'Yes, all our packages include necessary pooja materials and items. You can also purchase additional items from our collection.',
        category: 'Services',
        isActive: true
      },
      {
        question: 'Are your pandits experienced?',
        answer: 'Yes, all our pandits are highly experienced, well-versed in Sanskrit mantras, and knowledgeable about traditional rituals.',
        category: 'Services',
        isActive: true
      }
    ]);

    // 9. Create Test User and Testimonials
    console.log('👤 Creating test user and testimonials...');
    const testUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '9876543210',
      address: {
        street: '123 Temple Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    });

    await Testimonial.insertMany([
      {
        testimonial: 'The pooja was performed with utmost devotion and authenticity. The pandit ji was very knowledgeable and explained every ritual beautifully. Highly recommended!',
        service: 'Ganesh Chaturthi Celebration',
        rating: 5,
        user: testUser._id,
        isApproved: true
      },
      {
        testimonial: 'Professional service and experienced pandits. The decoration was beautiful and everything was arranged perfectly. Very satisfied with the experience.',
        service: 'Lakshmi Pooja',
        rating: 5,
        user: testUser._id,
        isApproved: true
      },
      {
        testimonial: 'Excellent service for our griha pravesh ceremony. The pandit ji performed all rituals according to tradition and the pooja items were of great quality.',
        service: 'Griha Pravesh Pooja',
        rating: 5,
        user: testUser._id,
        isApproved: true
      }
    ]);

    // 10. Create Admin (if not exists)
    console.log('👨‍💼 Creating admin...');
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'Admin'
      });
      console.log('✅ Default admin created');
    } else {
      console.log('✅ Admin already exists');
    }

    console.log('\n🎉 All data seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Services: ${services.length}`);
    console.log(`   Collections: ${collections.length}`);
    console.log(`   Poojas: ${poojas.length}`);
    console.log(`   Home Page Sections: 3`);
    console.log(`   Offers: 3`);
    console.log(`   Pages: 4`);
    console.log(`   FAQs: 6`);
    console.log(`   Testimonials: 3`);
    console.log(`   Test User: 1`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedAllData();
}

module.exports = seedAllData;
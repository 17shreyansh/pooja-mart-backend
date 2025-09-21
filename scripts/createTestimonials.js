const mongoose = require('mongoose');
const Testimonial = require('../models/Testimonial');
const User = require('../models/User');
require('dotenv').config();

const createTestimonials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('Test user not found. Please create a test user first.');
      process.exit(1);
    }

    const testimonials = [
      {
        testimonial: 'The pooja was performed with utmost devotion and authenticity. Highly recommended!',
        service: 'Ganesh Chaturthi Celebration',
        rating: 5,
        user: testUser._id,
        isApproved: true
      },
      {
        testimonial: 'Professional service and experienced pandits. Very satisfied with the experience.',
        service: 'Lakshmi Pooja',
        rating: 5,
        user: testUser._id,
        isApproved: true
      }
    ];

    // Clear existing testimonials
    await Testimonial.deleteMany({});

    for (const testimonialData of testimonials) {
      const testimonial = new Testimonial(testimonialData);
      await testimonial.save();
      console.log(`Created testimonial for ${testimonialData.service}`);
    }

    console.log('Testimonials created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating testimonials:', error);
    process.exit(1);
  }
};

createTestimonials();
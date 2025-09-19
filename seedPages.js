const mongoose = require('mongoose');
const Page = require('./models/Page');
require('dotenv').config();

const pages = [
  {
    slug: 'return-refund-policy',
    title: 'Return and Refund Policy',
    content: `
      <h2>Return and Refund Policy</h2>
      <p><strong>Effective Date:</strong> January 1, 2024</p>
      
      <h3>Returns</h3>
      <p>We accept returns within 7 days of delivery for unused pooja items in original packaging. Perishable items and customized poojas cannot be returned.</p>
      
      <h3>Refund Process</h3>
      <ul>
        <li>Contact us within 7 days of delivery</li>
        <li>Provide order number and reason for return</li>
        <li>Return items in original condition</li>
        <li>Refunds processed within 5-7 business days</li>
      </ul>
      
      <h3>Non-Returnable Items</h3>
      <ul>
        <li>Completed pooja services</li>
        <li>Perishable items (flowers, prasad)</li>
        <li>Customized or personalized items</li>
      </ul>
      
      <h3>Contact Us</h3>
      <p>For returns and refunds, contact us at:</p>
      <p>Email: returns@pujamart.com<br>Phone: +91 8929255775</p>
    `,
    isActive: true
  },
  {
    slug: 'terms-conditions',
    title: 'Terms and Conditions',
    content: `
      <h2>Terms and Conditions</h2>
      <p><strong>Last Updated:</strong> January 1, 2024</p>
      
      <h3>1. Acceptance of Terms</h3>
      <p>By using our services, you agree to these terms and conditions.</p>
      
      <h3>2. Services</h3>
      <p>We provide pooja services, religious items, and spiritual guidance. Services are subject to availability and pandit schedules.</p>
      
      <h3>3. Booking and Payment</h3>
      <ul>
        <li>Advance payment required for pooja bookings</li>
        <li>Cancellations must be made 24 hours in advance</li>
        <li>Rescheduling subject to pandit availability</li>
      </ul>
      
      <h3>4. User Responsibilities</h3>
      <ul>
        <li>Provide accurate booking information</li>
        <li>Ensure venue accessibility for pandits</li>
        <li>Respect religious customs and practices</li>
      </ul>
      
      <h3>5. Limitation of Liability</h3>
      <p>We are not liable for any spiritual outcomes or personal beliefs related to our services.</p>
      
      <h3>6. Contact Information</h3>
      <p>For questions about these terms, contact us at legal@pujamart.com</p>
    `,
    isActive: true
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: `
      <h2>Privacy Policy</h2>
      <p><strong>Effective Date:</strong> January 1, 2024</p>
      
      <h3>Information We Collect</h3>
      <ul>
        <li>Personal information (name, email, phone)</li>
        <li>Address for service delivery</li>
        <li>Payment information (processed securely)</li>
        <li>Service preferences and requirements</li>
      </ul>
      
      <h3>How We Use Your Information</h3>
      <ul>
        <li>Process and fulfill your orders</li>
        <li>Communicate about services and bookings</li>
        <li>Improve our services and customer experience</li>
        <li>Send promotional offers (with consent)</li>
      </ul>
      
      <h3>Information Sharing</h3>
      <p>We do not sell or share your personal information with third parties except:</p>
      <ul>
        <li>With pandits for service delivery</li>
        <li>With payment processors for transactions</li>
        <li>When required by law</li>
      </ul>
      
      <h3>Data Security</h3>
      <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      
      <h3>Your Rights</h3>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion of your data</li>
        <li>Opt-out of marketing communications</li>
      </ul>
      
      <h3>Contact Us</h3>
      <p>For privacy concerns, contact us at privacy@pujamart.com</p>
    `,
    isActive: true
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping Policy',
    content: `
      <h2>Shipping Policy</h2>
      <p><strong>Last Updated:</strong> January 1, 2024</p>
      
      <h3>Delivery Areas</h3>
      <p>We currently deliver to major cities across India. Check availability during checkout or contact us for specific locations.</p>
      
      <h3>Delivery Times</h3>
      <ul>
        <li><strong>Pooja Items:</strong> 2-5 business days</li>
        <li><strong>Fresh Items:</strong> Same day or next day delivery</li>
        <li><strong>Pandit Services:</strong> As per scheduled appointment</li>
      </ul>
      
      <h3>Shipping Charges</h3>
      <ul>
        <li>Free delivery on orders above ₹500</li>
        <li>Standard delivery: ₹50-100 depending on location</li>
        <li>Express delivery: ₹150-200</li>
        <li>Same day delivery: ₹200-300 (select cities)</li>
      </ul>
      
      <h3>Order Processing</h3>
      <ul>
        <li>Orders processed within 24 hours</li>
        <li>Tracking information provided via SMS/email</li>
        <li>Delivery confirmation required</li>
      </ul>
      
      <h3>Special Handling</h3>
      <ul>
        <li>Fragile items packed with extra care</li>
        <li>Perishable items delivered in insulated packaging</li>
        <li>Religious items handled with respect and care</li>
      </ul>
      
      <h3>Delivery Issues</h3>
      <p>Contact us immediately for:</p>
      <ul>
        <li>Damaged or missing items</li>
        <li>Delivery delays</li>
        <li>Incorrect orders</li>
      </ul>
      
      <h3>Contact Information</h3>
      <p>Shipping queries: shipping@pujamart.com<br>Phone: +91 8929255775</p>
    `,
    isActive: true
  }
];

const seedPages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    for (const pageData of pages) {
      const existingPage = await Page.findOne({ slug: pageData.slug });
      
      if (!existingPage) {
        const page = new Page(pageData);
        await page.save();
        console.log(`Created page: ${pageData.title}`);
      } else {
        console.log(`Page already exists: ${pageData.title}`);
      }
    }
    
    console.log('Page seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding pages:', error);
    process.exit(1);
  }
};

seedPages();
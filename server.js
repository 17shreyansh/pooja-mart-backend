const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const Admin = require('./models/Admin');
require('dotenv').config();

const app = express();

// Trust proxy for production deployment
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware with CORS-friendly helmet config
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://pooja-mart.vercel.app' : 'http://localhost:5173',
  credentials: true
}));

// Rate limiting with proper configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for admin panel static files
    return req.path.startsWith('/admin') && !req.path.startsWith('/api');
  }
});
// app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
  process.exit(1);
}

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    try {
      // Auto-seed data on startup (only in development or when forced)
      if (process.env.NODE_ENV !== 'production' || process.env.FORCE_SEED === 'true') {
        const seedAllData = require('./seed');
        
        // Check if data already exists
        const Admin = require('./models/Admin');
        const Category = require('./models/Category');
        
        const adminCount = await Admin.countDocuments();
        const categoryCount = await Category.countDocuments();
        
        if (adminCount === 0 || categoryCount === 0) {
          console.log('🌱 No data found, seeding database...');
          await seedAllData();
        } else {
          console.log('✅ Database already contains data');
        }
      } else {
        // In production, just ensure admin exists
        const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
          const admin = new Admin({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            name: 'Admin'
          });
          await admin.save();
          console.log('Default admin created');
        }
      }
    } catch (error) {
      console.error('Error during startup:', error.message);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user-auth', require('./routes/userAuth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/poojas', require('./routes/poojas'));
app.use('/api/pooja-collection', require('./routes/poojaCollection'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/search', require('./routes/search'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/home-page', require('./routes/homePage'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/cities', require('./routes/cities'));

// Serve admin panel
app.use(express.static('public'));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Handle rate limit errors gracefully
  if (err.code === 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR') {
    console.warn('Rate limit warning:', err.message);
    return next(); // Continue without rate limiting
  }
  
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
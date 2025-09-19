# Puja Mart Backend

Modern Express.js backend with professional admin panel for Puja Mart website.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create MongoDB database and update `.env` file

3. Start the server:
```bash
npm run dev
```

4. Access admin panel at: `http://localhost:5000/admin`

## Default Admin Credentials
- Email: admin@pujamart.com
- Password: admin123

## API Endpoints

### Authentication
- POST `/api/auth/login` - Admin login

### Services
- GET `/api/services` - Get all services
- POST `/api/services` - Create service (with image upload)
- PUT `/api/services/:id` - Update service
- DELETE `/api/services/:id` - Delete service

### Poojas
- GET `/api/poojas` - Get all poojas
- POST `/api/poojas` - Create pooja (with image upload)
- PUT `/api/poojas/:id` - Update pooja
- DELETE `/api/poojas/:id` - Delete pooja

### Pooja Collection
- GET `/api/pooja-collection` - Get all collection items
- POST `/api/pooja-collection` - Create item (with image upload)
- PUT `/api/pooja-collection/:id` - Update item
- DELETE `/api/pooja-collection/:id` - Delete item

### Testimonials
- GET `/api/testimonials` - Get all testimonials
- POST `/api/testimonials` - Create testimonial
- PUT `/api/testimonials/:id` - Update testimonial
- DELETE `/api/testimonials/:id` - Delete testimonial

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics
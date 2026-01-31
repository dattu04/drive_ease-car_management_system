# Car Management System

A full-stack car management system built with React (frontend) and Node.js/Express (backend).

## Features

- User authentication (login/register)
- Car inventory management
- Car booking/reservation system
- Test drive booking
- Spare parts ordering
- Service request management
- Admin approval workflows
- Location management

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Vite
- CSS3 (Glassmorphism design)

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt

## Local Development

### Prerequisites
- Node.js 18+ 
- MySQL 8+
- npm or yarn

### Backend Setup

```bash
cd car-management-system

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your database credentials

# Import database schema
mysql -u root -p < database.sql

# Start server
npm start
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
cms/
├── car-management-system/    # Backend
│   ├── config/               # Database configuration
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Auth middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── database.sql         # Database schema
│   └── server.js            # Entry point
│
└── frontend/                # Frontend
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API services
    │   ├── styles/          # CSS files
    │   └── assets/          # Images, etc.
    └── dist/               # Build output
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Cars
- GET `/api/cars` - Get all cars
- POST `/api/cars` - Add new car (admin)
- PUT `/api/cars/:id` - Update car (admin)
- DELETE `/api/cars/:id` - Delete car (admin)

### Reservations
- GET `/api/reservations` - Get all reservations
- POST `/api/reservations` - Create reservation
- PUT `/api/reservations/:id` - Update reservation
- DELETE `/api/reservations/:id` - Cancel reservation

### Test Drives
- GET `/api/testdrives` - Get all test drives
- POST `/api/testdrives` - Book test drive
- PUT `/api/testdrives/:id` - Update test drive
- DELETE `/api/testdrives/:id` - Cancel test drive

### Spare Parts
- GET `/api/spare-parts` - Get all spare parts
- POST `/api/spare-parts` - Add spare part (admin)
- PUT `/api/spare-parts/:id` - Update spare part (admin)
- DELETE `/api/spare-parts/:id` - Delete spare part (admin)

### Spare Part Bookings
- GET `/api/spare-bookings` - Get all bookings
- POST `/api/spare-bookings` - Create booking
- PUT `/api/spare-bookings/:id` - Update booking
- DELETE `/api/spare-bookings/:id` - Cancel booking

### Services
- GET `/api/services` - Get all service requests
- POST `/api/services` - Create service request
- PUT `/api/services/:id` - Update service request
- DELETE `/api/services/:id` - Cancel service request

### Locations
- GET `/api/locations` - Get all locations
- POST `/api/locations` - Add location (admin)
- PUT `/api/locations/:id` - Update location (admin)
- DELETE `/api/locations/:id` - Delete location (admin)

## User Roles

- **Customer**: Can book cars, test drives, order spare parts, request services
- **Admin**: Can manage inventory, approve bookings, manage locations
- **Manager**: Can view reports and manage bookings



// routes/sparePartBookingRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/sparePartBookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Customer routes
router.post('/', authMiddleware, controller.bookSparePart);
router.get('/my', authMiddleware, controller.getMyBookings);

// Admin/employee route
router.get('/', authMiddleware, controller.getAllBookings);

module.exports = router;

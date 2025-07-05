const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const authMiddleware = require("../middleware/authMiddleware");

// Add a new reservation (Only Employees)
router.post("/",authMiddleware.verifyToken, reservationController.addReservation);

// Get all reservations (Public Access)
router.get("/",authMiddleware.verifyToken, reservationController.getReservations);

// Get a reservation by ID (Public Access)
router.get("/:id",authMiddleware.verifyToken, reservationController.getReservationById);

// Update a reservation status (Only Supervisor)
router.put("/:id", authMiddleware.verifyToken, authMiddleware.checkSupervisor, reservationController.updateReservation);

// Delete a reservation (Only Supervisor)
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.checkSupervisor, reservationController.deleteReservation);

module.exports = router;

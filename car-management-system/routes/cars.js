const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all cars (Public Access)
router.get("/", carController.getCars);

// Add a car (Only Supervisor)
router.post("/", authMiddleware.verifyToken, authMiddleware.checkSupervisor, carController.addCar);

// Delete a car (Only Supervisor)
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.checkSupervisor, carController.deleteCar);

module.exports = router;

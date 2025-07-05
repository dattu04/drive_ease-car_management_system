const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const authMiddleware = require("../middleware/authMiddleware");

// Add a new location (Only Supervisor)
router.post("/", authMiddleware.verifyToken, authMiddleware.checkSupervisor, locationController.addLocation);

// Get all locations (Public Access)
router.get("/", locationController.getLocations);

// Get a location by ID (Public Access)
router.get("/:id", locationController.getLocationById);

// Update a location (Only Supervisor)
router.put("/:id", authMiddleware.verifyToken, authMiddleware.checkSupervisor, locationController.updateLocation);

// Delete a location (Only Supervisor)
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.checkSupervisor, locationController.deleteLocation);

module.exports = router;

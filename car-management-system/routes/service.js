const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");

// Add a new service record (Only Employees)
router.post("/", authMiddleware.verifyToken, serviceController.addService);

// Get all services (Only Employees)
router.get("/", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.getAllServices);

// Get a service by ID (Only Employees)
router.get("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.getServiceById);

// Get services by user ID (Only Employees)
router.get("/user/:userId", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.getServicesByUserId);

// Get services by location ID (Only Employees)
router.get("/location/:locationId", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.getServicesByLocationId);

// Update service status (Only Employees)
router.put("/:id/status", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.updateServiceStatus);

// Update service details (Only Employees)
router.put("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.updateService);

// Delete a service (Only Employees)
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.deleteService);

module.exports = router;
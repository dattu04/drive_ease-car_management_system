const express = require("express");
const router = express.Router();
const testDriveController = require("../controllers/testDriveController");
const authMiddleware = require("../middleware/authMiddleware");

// Add a new test drive booking
router.post("/", authMiddleware.verifyToken, testDriveController.addTestDrive);

// Get all test drives
router.get("/", authMiddleware.verifyToken, testDriveController.getTestDrives);

// Get a test drive by ID
router.get("/:id", authMiddleware.verifyToken, testDriveController.getTestDriveById);

// Get test drives by user
router.get("/user/:userId", authMiddleware.verifyToken, testDriveController.getUserTestDrives);

// Update a test drive status (Only Supervisor or Employee)
router.put("/:id", authMiddleware.verifyToken, authMiddleware.checkSupervisor, testDriveController.updateTestDrive);

// Delete a test drive (Only Supervisor)
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.checkSupervisor, testDriveController.deleteTestDrive);

module.exports = router;
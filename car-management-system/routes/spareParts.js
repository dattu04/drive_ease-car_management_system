const express = require("express");
const router = express.Router();
const sparePartsController = require("../controllers/sparePartsController");
const authMiddleware = require("../middleware/authMiddleware");

// Add a new spare part (Only Employees)
router.post("/", authMiddleware.verifyToken, authMiddleware.checkEmployee, sparePartsController.addSparePart);

// Get all spare parts (Public access for customers to view)
router.get("/", authMiddleware.verifyToken, sparePartsController.getSpareParts);

// Get a spare part by ID (Public access for customers to view)
router.get("/:id", authMiddleware.verifyToken, sparePartsController.getSparePartById);

// Update spare part stock quantity (Only Employees)
router.put("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, sparePartsController.updateSparePartStock);

// Delete a spare part (Only Employees)
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, sparePartsController.deleteSparePart);

module.exports = router;

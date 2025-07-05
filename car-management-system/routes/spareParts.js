const express = require("express");
const router = express.Router();
const sparePartsController = require("../controllers/sparePartsController");
const authMiddleware = require("../middleware/authMiddleware");

// Add a new spare part (Only Employees)
router.post("/", authMiddleware.verifyToken, authMiddleware.checkEmployee, sparePartsController.addSparePart);

// Get all spare parts (Only Employees)
router.get("/", authMiddleware.verifyToken, authMiddleware.checkEmployee, sparePartsController.getSpareParts);

// Get a spare part by ID (Only Employees)
router.get("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, sparePartsController.getSparePartById);

// Update spare part stock quantity (Only Employees)
router.put("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, sparePartsController.updateSparePartStock);

// Delete a spare part (Only Employees)
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, sparePartsController.deleteSparePart);

module.exports = router;

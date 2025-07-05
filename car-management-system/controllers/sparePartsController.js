const SparePart = require("../models/sparePartsModel");

exports.addSparePart = async (req, res) => {
    try {
        const { name, brand, price, stock_quantity, location_id } = req.body;

        if (!name || !brand || !price || stock_quantity === undefined || !location_id) {
            return res.status(400).json({ message: "All fields (name, brand, price, stock_quantity, location_id) are required!" });
        }

        const sparePartId = await SparePart.addSparePart({ name, brand, price, stock_quantity, location_id });
        res.status(201).json({ message: "Spare part added successfully!", sparePartId });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getSpareParts = async (req, res) => {
    try {
        const spareParts = await SparePart.getSpareParts();
        res.status(200).json(spareParts);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getSparePartById = async (req, res) => {
    try {
        const { id } = req.params;
        const sparePart = await SparePart.getSparePartById(id);

        if (!sparePart) {
            return res.status(404).json({ message: "Spare part not found" });
        }

        res.status(200).json(sparePart);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.updateSparePartStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock_quantity } = req.body;

        if (stock_quantity === undefined || stock_quantity < 0) {
            return res.status(400).json({ message: "Invalid stock quantity" });
        }

        const affectedRows = await SparePart.updateSparePartStock(id, stock_quantity);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Spare part not found" });
        }

        res.status(200).json({ message: "Stock updated successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.deleteSparePart = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRows = await SparePart.deleteSparePart(id);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Spare part not found" });
        }

        res.status(200).json({ message: "Spare part deleted successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

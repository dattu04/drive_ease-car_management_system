const Location = require("../models/locationmodel");

exports.addLocation = async (req, res) => {
    try {
        const { name, address, phone } = req.body;

        if (!name || !address || !phone) {
            return res.status(400).json({ message: "All fields are required: name, address, phone" });
        }

        const locationId = await Location.addLocation({ name, address, phone });
        res.status(201).json({ message: "Location added successfully!", locationId });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.getLocations();
        res.status(200).json(locations);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await Location.getLocationById(id);

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json(location);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phone } = req.body;

        if (!name && !address && !phone) {
            return res.status(400).json({ message: "Provide at least one field to update" });
        }

        const affectedRows = await Location.updateLocation(id, { name, address, phone });

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({ message: "Location updated successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRows = await Location.deleteLocation(id);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({ message: "Location deleted successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

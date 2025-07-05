const Car = require("../models/carModel");

exports.addCar = async (req, res) => {
    try {
        const { model, brand, year, price, availability, image } = req.body;

        if (!model || !brand || !year || !price) {
            return res.status(400).json({ message: "All fields are required: model, brand, year, price" });
        }

        const carId = await Car.addCar({ model, brand, year, price, availability, image });
        res.status(201).json({ message: "Car added successfully!", carId });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getCars = async (req, res) => {
    try {
        const cars = await Car.getCars();
        res.status(200).json(cars);
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Car ID is required" });
        }

        const affectedRows = await Car.deleteCar(id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json({ message: "Car deleted successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

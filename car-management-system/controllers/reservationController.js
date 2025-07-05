const Reservation = require("../models/reservationModel");

exports.addReservation = async (req, res) => {
    try {
        const { user_id, car_id, start_date, end_date, total_price, status } = req.body;

        if (!user_id || !car_id || !start_date || !end_date || !total_price) {
            return res.status(400).json({ message: "All fields (user_id, car_id, start_date, end_date, total_price) are required!" });
        }

        const reservationId = await Reservation.addReservation({ user_id, car_id, start_date, end_date, total_price, status });
        res.status(201).json({ message: "Reservation added successfully!", reservationId });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.getReservations();
        res.status(200).json(reservations);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.getReservationById(id);

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json(reservation);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "confirmed", "canceled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const affectedRows = await Reservation.updateReservation(id, status);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json({ message: "Reservation updated successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRows = await Reservation.deleteReservation(id);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json({ message: "Reservation deleted successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

// controllers/sparePartBookingController.js
const SparePartBooking = require("../models/sparePartBookingModel");

exports.bookSparePart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { spare_part_id, quantity } = req.body;

        if (!spare_part_id || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid part ID or quantity." });
        }

        const bookingId = await SparePartBooking.bookPart({ user_id, spare_part_id, quantity });
        res.status(201).json({ message: "Spare part booked successfully!", bookingId });

    } catch (error) {
        console.error("❌ Booking error:", error.message);
        res.status(500).json({ message: error.message || "Booking failed" });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const user_id = req.user.id;
        const bookings = await SparePartBooking.getUserBookings(user_id);
        res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ Fetch error:", error.message);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await SparePartBooking.getAllBookings();
        res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ Admin fetch error:", error.message);
        res.status(500).json({ message: "Failed to fetch all bookings" });
    }
};

// models/sparePartBookingModel.js
const db = require("../config/db");

const SparePartBooking = {
    bookPart: async ({ user_id, spare_part_id, quantity }) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Check stock
            const [rows] = await connection.execute(
                "SELECT stock_quantity FROM spare_parts WHERE id = ? FOR UPDATE",
                [spare_part_id]
            );

            if (rows.length === 0) throw new Error("Spare part not found.");
            if (rows[0].stock_quantity < quantity) throw new Error("Insufficient stock.");

            // Insert booking
            const [result] = await connection.execute(
                `INSERT INTO spare_part_bookings (user_id, spare_part_id, quantity)
                 VALUES (?, ?, ?)`,
                [user_id, spare_part_id, quantity]
            );

            // Reduce stock
            await connection.execute(
                `UPDATE spare_parts SET stock_quantity = stock_quantity - ? WHERE id = ?`,
                [quantity, spare_part_id]
            );

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    getUserBookings: async (user_id) => {
        const [rows] = await db.execute(
            `SELECT spb.*, sp.name AS part_name, sp.brand, sp.price
             FROM spare_part_bookings spb
             JOIN spare_parts sp ON spb.spare_part_id = sp.id
             WHERE spb.user_id = ?`,
            [user_id]
        );
        return rows;
    },

    getAllBookings: async () => {
        const [rows] = await db.execute(
            `SELECT spb.*, u.name AS user_name, sp.name AS part_name, sp.brand
             FROM spare_part_bookings spb
             JOIN users u ON spb.user_id = u.id
             JOIN spare_parts sp ON spb.spare_part_id = sp.id`
        );
        return rows;
    }
};

module.exports = SparePartBooking;

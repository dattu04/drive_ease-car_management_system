const db = require("../config/db");

const Reservation = {
    // Add a new reservation
    addReservation: async ({ user_id, car_id, start_date, end_date, total_price, status }) => {
        const query = `
            INSERT INTO reservations (user_id, car_id, start_date, end_date, total_price, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [user_id, car_id, start_date, end_date, total_price, status || "pending"];
        const [result] = await db.execute(query, values);
        return result.insertId;
    },

    // Get all reservations
    getReservations: async () => {
        const [results] = await db.execute("SELECT * FROM reservations");
        return results;
    },

    // Get a reservation by ID
    getReservationById: async (id) => {
        const [results] = await db.execute("SELECT * FROM reservations WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },

    // Update reservation status
    updateReservation: async (id, status) => {
        const query = "UPDATE reservations SET status = ? WHERE id = ?";
        const [result] = await db.execute(query, [status, id]);
        return result.affectedRows;
    },

    // Delete a reservation
    deleteReservation: async (id) => {
        const [result] = await db.execute("DELETE FROM reservations WHERE id = ?", [id]);
        return result.affectedRows;
    }
};

module.exports = Reservation;


const db = require("../config/db");

const SparePart = {
    // Add a new spare part
    addSparePart: async ({ name, brand, price, stock_quantity, location_id }) => {
        const query = `
            INSERT INTO spare_parts (name, brand, price, stock_quantity, location_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [name, brand, price, stock_quantity, location_id]);
        return result.insertId;
    },

    // Get all spare parts
    getSpareParts: async () => {
        const query = "SELECT * FROM spare_parts";
        const [rows] = await db.execute(query);
        return rows;
    },

    // Get a spare part by ID
    getSparePartById: async (id) => {
        const query = "SELECT * FROM spare_parts WHERE id = ?";
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    },

    // Update spare part stock
    updateSparePartStock: async (id, stock_quantity) => {
        const query = "UPDATE spare_parts SET stock_quantity = ? WHERE id = ?";
        const [result] = await db.execute(query, [stock_quantity, id]);
        return result.affectedRows;
    },

    // Delete a spare part
    deleteSparePart: async (id) => {
        const query = "DELETE FROM spare_parts WHERE id = ?";
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }
};

module.exports = SparePart;
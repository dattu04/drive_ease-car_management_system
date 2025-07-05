const db = require("../config/db");

const Location = {
    // Add a new location
    addLocation: async ({ name, address, phone }) => {
        const query = `INSERT INTO locations (name, address, phone) VALUES (?, ?, ?)`;
        const values = [name, address, phone];
        const [result] = await db.execute(query, values);
        return result.insertId;
    },

    // Get all locations
    getLocations: async () => {
        const [results] = await db.execute("SELECT * FROM locations");
        return results;
    },

    // Get a location by ID
    getLocationById: async (id) => {
        const [results] = await db.execute("SELECT * FROM locations WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },

    // Update a location
    updateLocation: async (id, { name, address, phone }) => {
        const query = `UPDATE locations SET name = ?, address = ?, phone = ? WHERE id = ?`;
        const values = [name, address, phone, id];
        const [result] = await db.execute(query, values);
        return result.affectedRows;
    },

    // Delete a location
    deleteLocation: async (id) => {
        const [result] = await db.execute("DELETE FROM locations WHERE id = ?", [id]);
        return result.affectedRows;
    }
};

module.exports = Location;

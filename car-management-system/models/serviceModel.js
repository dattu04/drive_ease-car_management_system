const db = require("../config/db");

const Service = {
    // Add a new service record
    addService: async ({ user_id, car_id, location_id, service_date, description, cost, status }) => {
        const query = `
            INSERT INTO services (user_id, car_id, location_id, service_date, description, cost, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [user_id, car_id, location_id, service_date, description, cost, status || "pending"];
        const [result] = await db.execute(query, values);
        return result.insertId;
    },

    // Get all services
    getAllServices: async () => {
        const query = `
            SELECT s.*, l.name as location_name, l.address as location_address 
            FROM services s
            JOIN locations l ON s.location_id = l.id
        `;
        const [results] = await db.execute(query);
        return results;
    },

    // Get a service by ID
    getServiceById: async (id) => {
        const query = `
            SELECT s.*, l.name as location_name, l.address as location_address 
            FROM services s
            JOIN locations l ON s.location_id = l.id
            WHERE s.id = ?
        `;
        const [results] = await db.execute(query, [id]);
        return results.length > 0 ? results[0] : null;
    },

    // Get services by user ID
    getServicesByUserId: async (userId) => {
        const query = `
            SELECT s.*, l.name as location_name, l.address as location_address 
            FROM services s
            JOIN locations l ON s.location_id = l.id
            WHERE s.user_id = ?
        `;
        const [results] = await db.execute(query, [userId]);
        return results;
    },

    // Get services by location ID
    getServicesByLocationId: async (locationId) => {
        const query = `
            SELECT s.*, l.name as location_name
            FROM services s
            JOIN locations l ON s.location_id = l.id
            WHERE s.location_id = ?
        `;
        const [results] = await db.execute(query, [locationId]);
        return results;
    },

    // Update service status
    updateServiceStatus: async (id, status) => {
        const query = "UPDATE services SET status = ? WHERE id = ?";
        const [result] = await db.execute(query, [status, id]);
        return result.affectedRows;
    },

    // Update service details
    updateService: async (id, { location_id, service_date, description, cost, status }) => {
        const query = `
            UPDATE services 
            SET location_id = ?, service_date = ?, description = ?, cost = ?, status = ?
            WHERE id = ?
        `;
        const values = [location_id, service_date, description, cost, status, id];
        const [result] = await db.execute(query, values);
        return result.affectedRows;
    },

    // Delete a service
    deleteService: async (id) => {
        const [result] = await db.execute("DELETE FROM services WHERE id = ?", [id]);
        return result.affectedRows;
    }
};

module.exports = Service;
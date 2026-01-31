const db = require("../config/db");

const TestDrive = {
    // Add a new test drive booking
    addTestDrive: async ({ user_id, car_id, test_drive_date, test_drive_time, location_id, notes, status }) => {
        const query = `
            INSERT INTO test_drives (user_id, car_id, test_drive_date, test_drive_time, location_id, notes, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [user_id, car_id, test_drive_date, test_drive_time, location_id, notes || null, status || "pending"];
        const [result] = await db.execute(query, values);
        return result.insertId;
    },

    // Get all test drives
    getTestDrives: async () => {
        const query = `
            SELECT td.*, u.name as user_name, u.email as user_email, 
                   c.model as car_model, c.brand as car_brand,
                   l.name as location_name, l.address as location_address
            FROM test_drives td
            JOIN users u ON td.user_id = u.id
            JOIN cars c ON td.car_id = c.id
            JOIN locations l ON td.location_id = l.id
            ORDER BY td.created_at DESC
        `;
        const [results] = await db.execute(query);
        return results;
    },

    // Get a test drive by ID
    getTestDriveById: async (id) => {
        const query = `
            SELECT td.*, u.name as user_name, u.email as user_email,
                   c.model as car_model, c.brand as car_brand,
                   l.name as location_name, l.address as location_address
            FROM test_drives td
            JOIN users u ON td.user_id = u.id
            JOIN cars c ON td.car_id = c.id
            JOIN locations l ON td.location_id = l.id
            WHERE td.id = ?
        `;
        const [results] = await db.execute(query, [id]);
        return results.length > 0 ? results[0] : null;
    },

    // Get test drives by user
    getUserTestDrives: async (userId) => {
        const query = `
            SELECT td.*, c.model as car_model, c.brand as car_brand,
                   l.name as location_name, l.address as location_address
            FROM test_drives td
            JOIN cars c ON td.car_id = c.id
            JOIN locations l ON td.location_id = l.id
            WHERE td.user_id = ?
            ORDER BY td.test_drive_date DESC, td.test_drive_time DESC
        `;
        const [results] = await db.execute(query, [userId]);
        return results;
    },

    // Update test drive status
    updateTestDrive: async (id, { status, notes }) => {
        const query = "UPDATE test_drives SET status = ?, notes = ? WHERE id = ?";
        const [result] = await db.execute(query, [status, notes || null, id]);
        return result.affectedRows;
    },

    // Delete a test drive
    deleteTestDrive: async (id) => {
        const [result] = await db.execute("DELETE FROM test_drives WHERE id = ?", [id]);
        return result.affectedRows;
    },

    // Check if a time slot is available
    checkAvailability: async (car_id, test_drive_date, test_drive_time, location_id) => {
        const query = `
            SELECT COUNT(*) as count 
            FROM test_drives 
            WHERE car_id = ? 
            AND test_drive_date = ? 
            AND test_drive_time = ? 
            AND location_id = ?
            AND status NOT IN ('canceled', 'completed')
        `;
        const [results] = await db.execute(query, [car_id, test_drive_date, test_drive_time, location_id]);
        return results[0].count === 0;
    }
};

module.exports = TestDrive;
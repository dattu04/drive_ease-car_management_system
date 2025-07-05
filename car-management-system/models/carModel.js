const db = require("../config/db");

const Car = {
    // Add a new car
    addCar: async ({ model, brand, year, price, availability = 1, image = null }) => {
        const query = `
            INSERT INTO cars (model, brand, year, price, availability, image) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [model, brand, year, price, availability, image];
        const [result] = await db.execute(query, values);
        return result.insertId;
    },

    // Get all cars
    getCars: async () => {
        const [results] = await db.execute("SELECT * FROM cars");
        return results;
    },

    // Delete a car by ID
    deleteCar: async (id) => {
        const [result] = await db.execute("DELETE FROM cars WHERE id = ?", [id]);
        return result.affectedRows;
    }
};

module.exports = Car;

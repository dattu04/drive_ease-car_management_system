const db = require("../config/db");
const bcrypt = require("bcrypt");

// Function to find a user by email
exports.findByEmail = async (email) => {
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return user.length ? user[0] : null;
};

// Function to create a new user
exports.createUser = async (name, email, password, phone, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db.query(
        "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, phone, role]
    );
};

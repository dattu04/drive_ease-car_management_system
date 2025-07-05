const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel"); // Import userModel
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Check if user exists
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered!" });
        }

        // Create new user
        await userModel.createUser(name, email, password, phone, role);
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
};

// ✅ User login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required!" });
        }

        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};

// ✅ Logout (Token-based)
exports.logout = async (req, res) => {
    try {
        // Clients should remove token on logout
        res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Server error during logout" });
    }
};

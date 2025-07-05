const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Middleware
app.use(helmet());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for development
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Import routes
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars");
const locationRoutes = require("./routes/locations");
const reservationRoutes = require("./routes/reservations");
const serviceRoutes = require("./routes/service");
const sparePartsRoutes = require("./routes/spareParts");
const sparePartBookingRoutes = require("./routes/sparePartBooking");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/spare-parts", sparePartsRoutes);
app.use("/api/spare-bookings", sparePartBookingRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Car Management System API" });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === "development" ? err.message : undefined 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

module.exports = app; // Export for testing purposes
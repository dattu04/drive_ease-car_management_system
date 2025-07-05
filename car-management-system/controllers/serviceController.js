const Service = require("../models/serviceModel");

exports.addService = async (req, res) => {
    try {
        const user_id = req.user.id; // from the verified token
        const { car_id, location_id, service_date, description, cost } = req.body;

        if (!car_id || !location_id || !service_date || !description || cost === undefined) {
            return res.status(400).json({ message: "All fields (car_id, location_id, service_date, description, cost) are required!" });
        }

        const serviceId = await Service.addService({
            user_id,
            car_id,
            location_id,
            service_date,
            description,
            cost,
            status: "pending"
        });

        res.status(201).json({ message: "Service booked successfully!", serviceId });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};


exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.getAllServices();
        res.status(200).json(services);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.getServiceById(id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json(service);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getServicesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const services = await Service.getServicesByUserId(userId);
        
        res.status(200).json(services);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getServicesByLocationId = async (req, res) => {
    try {
        const { locationId } = req.params;
        const services = await Service.getServicesByLocationId(locationId);
        
        res.status(200).json(services);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.updateServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "in_progress", "completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const affectedRows = await Service.updateServiceStatus(id, status);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ message: "Service status updated successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { location_id, service_date, description, cost, status } = req.body;

        if (!location_id || !service_date || !description || cost === undefined || !status) {
            return res.status(400).json({ message: "All fields (location_id, service_date, description, cost, status) are required!" });
        }

        const affectedRows = await Service.updateService(id, {
            location_id,
            service_date,
            description,
            cost,
            status
        });

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ message: "Service updated successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRows = await Service.deleteService(id);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ message: "Service deleted successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};
const TestDrive = require("../models/testDriveModel");

exports.addTestDrive = async (req, res) => {
    try {
        const { user_id, car_id, test_drive_date, test_drive_time, location_id, notes, status } = req.body;

        if (!user_id || !car_id || !test_drive_date || !test_drive_time || !location_id) {
            return res.status(400).json({ 
                message: "All fields (user_id, car_id, test_drive_date, test_drive_time, location_id) are required!" 
            });
        }

        // Check if the time slot is available
        const isAvailable = await TestDrive.checkAvailability(car_id, test_drive_date, test_drive_time, location_id);
        
        if (!isAvailable) {
            return res.status(409).json({ 
                message: "This time slot is already booked. Please choose a different time." 
            });
        }

        const testDriveId = await TestDrive.addTestDrive({ 
            user_id, 
            car_id, 
            test_drive_date, 
            test_drive_time, 
            location_id, 
            notes, 
            status 
        });
        
        res.status(201).json({ 
            message: "Test drive booking created successfully!", 
            testDriveId 
        });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error", error: error.message });
    }
};

exports.getTestDrives = async (req, res) => {
    try {
        const testDrives = await TestDrive.getTestDrives();
        res.status(200).json(testDrives);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getTestDriveById = async (req, res) => {
    try {
        const { id } = req.params;
        const testDrive = await TestDrive.getTestDriveById(id);

        if (!testDrive) {
            return res.status(404).json({ message: "Test drive not found" });
        }

        res.status(200).json(testDrive);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getUserTestDrives = async (req, res) => {
    try {
        const { userId } = req.params;
        const testDrives = await TestDrive.getUserTestDrives(userId);

        res.status(200).json(testDrives);

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.updateTestDrive = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!["pending", "confirmed", "completed", "canceled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const affectedRows = await TestDrive.updateTestDrive(id, { status, notes });

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Test drive not found" });
        }

        res.status(200).json({ message: "Test drive updated successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};

exports.deleteTestDrive = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRows = await TestDrive.deleteTestDrive(id);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Test drive not found" });
        }

        res.status(200).json({ message: "Test drive deleted successfully!" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
};
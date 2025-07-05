const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

exports.checkSupervisor = (req, res, next) => {
  if (!req.user || req.user.role !== "supervisor") {
    return res.status(403).json({ message: "Access Denied: Supervisor only" });
  }
  next();
};

exports.checkEmployee = (req, res, next) => {
  if (!req.user || (req.user.role !== "supervisor" && req.user.role !== "employee")) {
    return res.status(403).json({ message: "Access Denied: Employees and Supervisors only" });
  }
  next();
};
-- Switch to the correct database
CREATE DATABASE IF NOT EXISTS car_management;
USE car_management;

-- Drop existing tables (to avoid duplicate errors)
DROP TABLE IF EXISTS login_sessions;
DROP TABLE IF EXISTS employee_logs;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS spare_parts;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS cars;


-- Users Table (Unified for Customers & Employees)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role ENUM('customer', 'employee', 'supervisor') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars Table
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    year INT NOT NULL, -- Validates car manufacturing year
    price DECIMAL(10,2) NOT NULL,
    availability TINYINT(1) DEFAULT 1, -- Using TINYINT(1) for boolean values
    image VARCHAR(255), -- Stores image path or URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations Table (For car bookings)
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    start_date DATE NOT NULL , -- No dynamic date in CHECK
    end_date DATE NOT NULL ,
    total_price DECIMAL(10,2) NOT NULL ,
    status ENUM('pending', 'approved', 'canceled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Locations Table (Rental locations or service centers)
CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spare Parts Table (Stock Management)
CREATE TABLE spare_parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    location_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);
CREATE TABLE spare_part_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    spare_part_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    status ENUM('booked', 'completed', 'cancelled') DEFAULT 'booked',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id) ON DELETE CASCADE
);

-- Service Requests Table (For car servicing)
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    location_id INT NOT NULL, -- Added location reference
    service_date DATE NOT NULL CHECK (service_date >= '2024-01-01'), -- No dynamic function
    description TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL CHECK (cost >= 0),
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE RESTRICT -- Added foreign key constraint
);

-- Login Sessions Table (Tracks logins)
CREATE TABLE login_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Employee Actions Table (For employee activities)
CREATE TABLE employee_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE approve_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  user_name VARCHAR(100), -- optional, denormalized
  car_id INT NOT NULL,
  description TEXT,
  start_date DATETIME NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (car_id) REFERENCES cars(id)
);

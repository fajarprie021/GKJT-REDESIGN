-- SQL Script to set up the database for Next.js + MySQL Demo
-- Run this in phpMyAdmin or MySQL command line

-- 1. Create the database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS nextjs_demo;

-- 2. Use the database
USE nextjs_demo;

-- 3. Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Insert some sample data (optional)
INSERT INTO users (name, email) VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com'),
    ('Bob Wilson', 'bob@example.com');

-- 5. Verify the data
SELECT * FROM users;

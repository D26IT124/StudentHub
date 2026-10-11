-- StudentHub Database Schema
-- Practical 8: Database Integration

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Create Database
CREATE DATABASE IF NOT EXISTS studenthub_db;
USE studenthub_db;

-- 1. Create courses table
CREATE TABLE IF NOT EXISTS courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 2. Create students table
CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Create events table
CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    event_location VARCHAR(255),
    description TEXT
) ENGINE=InnoDB;

-- 4. Create registrations table (Linking students and events)
CREATE TABLE IF NOT EXISTS registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (student_id, event_id) -- Prevent duplicate registration for the same event
) ENGINE=InnoDB;

-- Insert Sample Courses
INSERT INTO courses (course_name) VALUES
('B.Tech Information Technology'),
('B.Tech Computer Science'),
('B.Tech Electronics & Communication'),
('MCA'),
('M.Sc Computer Science');

-- Insert Sample Students
INSERT INTO students (name, email, course_id) VALUES
('Aarav Sharma', 'aarav.sharma@example.com', 1),
('Ishani Patel', 'ishani.patel@example.com', 1),
('Vihaan Gupta', 'vihaan.gupta@example.com', 2),
('Ananya Iyer', 'ananya.iyer@example.com', 2),
('Sai Reddy', 'sai.reddy@example.com', 3),
('Meera Nair', 'meera.nair@example.com', 4),
('Kabir Malhotra', 'kabir.malhotra@example.com', 5),
('Riya Das', 'riya.das@example.com', 1),
('Aditya Verma', 'aditya.verma@example.com', 2),
('Sana Khan', 'sana.khan@example.com', 3);

-- Insert Sample Events
INSERT INTO events (event_name, event_date, event_location, description) VALUES
('Tech Symposium 2026', '2026-11-15', 'Main Auditorium', 'Annual technical event showcasing student projects.'),
('Hackathon: Build for Future', '2026-12-01', 'IT Lab 1', '24-hour coding challenge to solve real-world problems.'),
('AI & ML Workshop', '2026-10-20', 'Seminar Hall B', 'Hands-on workshop on Neural Networks and PyTorch.'),
('Career Guidance Seminar', '2026-11-05', 'Conference Room 1', 'Guidance on placements and higher studies.'),
('Cloud Computing Expo', '2026-12-10', 'Campus Ground', 'Exploring AWS, Azure and GCP ecosystems.');

-- Insert Sample Registrations
INSERT INTO registrations (student_id, event_id) VALUES
(1, 1), (1, 3), (2, 1), (3, 2), (4, 2), (5, 3), (6, 4), (7, 5), (8, 1), (9, 2), (10, 3);

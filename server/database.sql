-- Create Database
CREATE DATABASE IF NOT EXISTS pencilbitz_db;
USE pencilbitz_db;

-- 1. Conferences Table
CREATE TABLE IF NOT EXISTS conferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conferencename VARCHAR(255),
    conferencetitle VARCHAR(500),
    isbn VARCHAR(500),
    type VARCHAR(255),
    about TEXT,
    dates JSON,
    conferencestatus VARCHAR(500),
    conferencesecurity VARCHAR(500),
    conferencevalidity VARCHAR(500),
    registerlink VARCHAR(500),
    poster VARCHAR(500),
    brochuredownload VARCHAR(500),
    proceedingsdownload VARCHAR(500),
    listenerparticipation VARCHAR(500),
    certificatesdownload JSON,
    topics JSON,
    fees JSON,
    bankdetails JSON,
    speakers JSON,
    organizingcommittee JSON,
    advisorycommittee JSON,
    globalexperts JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Books Table (Store Books)
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    authors VARCHAR(255) NOT NULL,
    isbn VARCHAR(50),
    edition VARCHAR(50),
    ratings INT DEFAULT 5,
    about TEXT,                            -- Lowercase for consistency
    price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'In Stock',
    weight VARCHAR(255),
    binding VARCHAR(100),
    dimensions VARCHAR(100),
    language VARCHAR(100),
    format VARCHAR(100),                   -- Fixed: Added size constraints
    pages INT,
    copyright VARCHAR(50),                 -- Fixed: Corrected spelling
    cover1 VARCHAR(500),
    cover2 VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    rating INT DEFAULT 5,
    avatar_url VARCHAR(500),
    is_video_testimonial BOOLEAN
    video_url VARCHAR(500),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    collegeName VARCHAR(255),
    topic VARCHAR(255),
    date Varchar(100),
    time Varchar(100),
    status VARCHAR(50) DEFAULT 'Upcoming',
    location VARCHAR(255),
    contact1 VARCHAR(50),
    contact2 VARCHAR(50),
    registrationLink VARCHAR(500),
    registerButtonText VARCHAR(100),
    poster varchar(100),
    certificate Varchar(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    formType VARCHAR(100),
    message TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Team Contacts Table
CREATE TABLE IF NOT EXISTS team_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    photo VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


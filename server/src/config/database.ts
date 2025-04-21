import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const initializeDatabase = async () => {
  try {
    // Test the connection
    const connection = await pool.getConnection();
    console.log('✅ Database connection established');
    connection.release();

    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

const createTables = async () => {
  const connection = await pool.getConnection();
  try {
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('employee', 'employer') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Drop and recreate profiles table to ensure correct schema
    await connection.execute('DROP TABLE IF EXISTS profiles');
    await connection.execute(`
      CREATE TABLE profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        avatar_url VARCHAR(255),
        title VARCHAR(255),
        skills JSON,
        experience_years INT,
        education TEXT,
        resume_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        github_url VARCHAR(255),
        bio TEXT,
        preferred_location VARCHAR(255),
        preferred_job_type ENUM('full-time', 'part-time', 'contract', 'internship'),
        preferred_work_environment ENUM('remote', 'hybrid', 'on-site'),
        company_name VARCHAR(255),
        company_website VARCHAR(255),
        industry VARCHAR(255),
        company_size VARCHAR(50),
        company_description TEXT,
        company_logo_url VARCHAR(255),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Resumes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        file_url VARCHAR(255) NOT NULL,
        upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // AI resume scores table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ai_resume_scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        score FLOAT NOT NULL,
        analysis TEXT NOT NULL,
        scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables created/verified');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export default pool; 



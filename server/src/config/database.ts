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

    // Profiles table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS profiles (
        user_id INT PRIMARY KEY,
        name VARCHAR(255),
        skills TEXT,
        experience TEXT,
        education TEXT,
        desired_job_type VARCHAR(255),
        company_name VARCHAR(255),
        job_title VARCHAR(255),
        job_description TEXT,
        location VARCHAR(255),
        resume_score INT DEFAULT 0,
        resume_file_url VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Swipe decisions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS swipe_decisions (
        employer_id INT,
        employee_id INT,
        decision ENUM('accept', 'decline') NOT NULL,
        decision_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (employer_id, employee_id),
        FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Resumes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT,
        file_url VARCHAR(255) NOT NULL,
        upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // AI resume scores table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ai_resume_scores (
        resume_id INT,
        score INT NOT NULL,
        analysis TEXT,
        scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (resume_id),
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



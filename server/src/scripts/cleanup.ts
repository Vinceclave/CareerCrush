import pool from '../config/database';

async function cleanupDatabase() {
  try {
    console.log('Starting database cleanup...');
    
    // First, disable foreign key checks
    await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    // Drop tables in correct order to handle dependencies
    const tables = [
      'ai_resume_scores',
      'resumes',
      'profiles',
      'users'
    ];
    
    for (const table of tables) {
      console.log(`Dropping table ${table}...`);
      await pool.execute(`DROP TABLE IF EXISTS ${table}`);
    }
    
    // Re-enable foreign key checks
    await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Creating tables...');
    
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('employee', 'employer', 'admin') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create profiles table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        location VARCHAR(255),
        bio TEXT,
        profile_picture_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create resumes table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        file_url VARCHAR(255) NOT NULL,
        upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create ai_resume_scores table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_resume_scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        score FLOAT NOT NULL,
        analysis TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database cleanup and reinitialization completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
    // Make sure to re-enable foreign key checks even if there's an error
    await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
    throw error;
  } finally {
    await pool.end();
  }
}

cleanupDatabase().catch(error => {
  console.error('Cleanup failed:', error);
  process.exit(1);
}); 
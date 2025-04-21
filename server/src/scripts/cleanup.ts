import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { initializeDatabase } from '../config/database';

dotenv.config();

const cleanupDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Starting database cleanup...');

    // Drop all tables in the correct order (respecting foreign key constraints)
    await connection.execute('DROP TABLE IF EXISTS ai_resume_scores');
    await connection.execute('DROP TABLE IF EXISTS resumes');
    await connection.execute('DROP TABLE IF EXISTS swipe_decisions');
    await connection.execute('DROP TABLE IF EXISTS profiles');
    await connection.execute('DROP TABLE IF EXISTS users');

    console.log('✅ All tables dropped successfully');

    // Reinitialize database
    await initializeDatabase();
    console.log('✅ Database reinitialized successfully');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

// Run cleanup if this script is executed directly
if (require.main === module) {
  cleanupDatabase()
    .then(() => {
      console.log('Cleanup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Cleanup failed:', error);
      process.exit(1);
    });
}

export default cleanupDatabase; 
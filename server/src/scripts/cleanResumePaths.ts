import pool from '../config/database';
import path from 'path';

interface Resume {
  id: number;
  employee_id: number;
  file_url: string;
  upload_timestamp: Date;
}

async function cleanResumePaths() {
  try {
    // Get all resumes from the database
    const [resumes] = await pool.execute('SELECT * FROM resumes');
    
    console.log(`Found ${resumes.length} resumes to clean`);
    
    for (const resume of resumes as Resume[]) {
      // Clean the file path
      const cleanPath = resume.file_url
        .replace(/^\/?uploads\//, '')  // Remove leading uploads/
        .replace(/^\/?resumes\//, '')  // Remove leading resumes/
        .replace(/\/+/g, '/');         // Replace multiple slashes with single slash
      
      // Construct the new path
      const newPath = `resumes/${cleanPath}`;
      
      // Only update if the path has changed
      if (newPath !== resume.file_url) {
        console.log(`Updating resume ${resume.id}:`);
        console.log(`Old path: ${resume.file_url}`);
        console.log(`New path: ${newPath}`);
        
        // Update the database
        await pool.execute(
          'UPDATE resumes SET file_url = ? WHERE id = ?',
          [newPath, resume.id]
        );
      }
    }
    
    console.log('Resume path cleanup completed');
  } catch (error) {
    console.error('Error cleaning resume paths:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

cleanResumePaths(); 
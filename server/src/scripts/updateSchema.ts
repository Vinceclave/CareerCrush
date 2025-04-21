import pool from '../config/database';

async function updateSchema() {
  try {
    console.log('Starting schema update...');
    
    // Add scored_at column if it doesn't exist
    await pool.execute(`
      ALTER TABLE ai_resume_scores 
      ADD COLUMN IF NOT EXISTS scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    
    // If created_at exists, copy its values to scored_at and then drop it
    await pool.execute(`
      UPDATE ai_resume_scores 
      SET scored_at = created_at 
      WHERE scored_at IS NULL AND created_at IS NOT NULL
    `);
    
    await pool.execute(`
      ALTER TABLE ai_resume_scores 
      DROP COLUMN IF EXISTS created_at
    `);
    
    console.log('✅ Schema update completed successfully');
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the update
updateSchema().catch(console.error); 
import { Router, Request, Response } from 'express';
import { ResumeModel, AIResumeScore } from '../models/Resume';
import { authenticateToken } from '../middleware/auth';
import pool from '../config/database';

const router = Router();

// Search for candidates based on resume scores
router.get('/search-candidates', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { 
      min_score = 0.6,  // Default minimum score
      job_type = 'technical',  // Default job type
      limit = 10,  // Default number of results
      offset = 0   // Default offset for pagination
    } = req.query;

    // Convert query parameters to numbers
    const minScore = parseFloat(min_score as string);
    const resultLimit = parseInt(limit as string);
    const resultOffset = parseInt(offset as string);

    console.log('Search parameters:', { minScore, job_type, resultLimit, resultOffset });

    // Validate data existence
    const [validation] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT r.id) as total_resumes,
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT p.id) as total_profiles,
        COUNT(DISTINCT ars.id) as total_scores
      FROM resumes r
      LEFT JOIN users u ON r.employee_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN ai_resume_scores ars ON r.id = ars.resume_id
    `);

    const validationData = (validation as any[])[0];
    console.log('Data validation:', validationData);

    if (validationData.total_resumes === 0) {
      return res.status(404).json({ 
        error: 'No resumes found',
        details: 'No resumes exist in the database'
      });
    }

    if (validationData.total_scores === 0) {
      return res.status(404).json({ 
        error: 'No resume scores found',
        details: 'No AI resume scores exist in the database'
      });
    }

    // Get top matching resumes with profile information
    const [rows] = await pool.execute(`
      SELECT 
        r.id as resume_id,
        r.employee_id,
        r.file_url,
        ars.score,
        ars.analysis,
        ars.scored_at,
        p.first_name,
        p.last_name,
        p.avatar_url,
        p.title,
        p.skills,
        p.experience_years,
        p.education,
        p.linkedin_url,
        p.preferred_location,
        p.preferred_job_type,
        u.email as employee_email,
        u.role as user_role
      FROM resumes r
      INNER JOIN users u ON r.employee_id = u.id
      INNER JOIN profiles p ON u.id = p.user_id
      INNER JOIN ai_resume_scores ars ON r.id = ars.resume_id
      WHERE ars.score >= ?
        AND u.role = 'employee'  -- Ensure we only get employee profiles
      ORDER BY ars.score DESC
      LIMIT ? OFFSET ?
    `, [minScore, resultLimit, resultOffset]);

    console.log('Found candidates:', (rows as any[]).length);

    // Format the response
    const candidates = (rows as any[]).map(row => ({
      resume_id: row.resume_id,
      employee_id: row.employee_id,
      employee_name: `${row.first_name} ${row.last_name}`,
      employee_email: row.employee_email,
      avatar_url: row.avatar_url,
      title: row.title,
      skills: JSON.parse(row.skills || '[]'),
      experience_years: row.experience_years,
      education: row.education,
      linkedin_url: row.linkedin_url,
      preferred_location: row.preferred_location,
      preferred_job_type: row.preferred_job_type,
      score: row.score,
      analysis: row.analysis,
      scored_at: row.scored_at,
      match_percentage: (row.score * 100).toFixed(2) + '%'
    }));

    // Get total count for pagination
    const [totalRows] = await pool.execute(`
      SELECT COUNT(*) as total
      FROM resumes r
      INNER JOIN users u ON r.employee_id = u.id
      INNER JOIN profiles p ON u.id = p.user_id
      INNER JOIN ai_resume_scores ars ON r.id = ars.resume_id
      WHERE ars.score >= ?
        AND u.role = 'employee'
    `, [minScore]);

    const total = (totalRows as any[])[0].total;

    res.json({
      candidates,
      pagination: {
        total,
        limit: resultLimit,
        offset: resultOffset
      }
    });
  } catch (error: any) {
    console.error('Error searching candidates:', error);
    console.error('Error details:', {
      message: error.message,
      sql: error.sql,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Get detailed analysis for a specific resume
router.get('/resume/:id/analysis', authenticateToken, async (req: Request, res: Response) => {
  try {
    const resumeId = parseInt(req.params.id);
    const score = await ResumeModel.getResumeScore(resumeId);
    
    if (!score) {
      return res.status(404).json({ error: 'Resume analysis not found' });
    }

    res.json({
      resume_id: resumeId,
      score: score.score,
      match_percentage: (score.score * 100).toFixed(2) + '%',
      analysis: score.analysis,
      scored_at: score.scored_at
    });
  } catch (error: any) {
    console.error('Error getting resume analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top skills from resumes
router.get('/top-skills', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { limit = 20 } = req.query;
    const resultLimit = parseInt(limit as string);

    // Get top skills from resume analyses
    const [rows] = await pool.execute(`
      SELECT 
        keyword,
        COUNT(*) as frequency
      FROM (
        SELECT 
          SUBSTRING_INDEX(SUBSTRING_INDEX(analysis, 'Matching Keywords: ', -1), ',', numbers.n) as keyword
        FROM ai_resume_scores
        JOIN (
          SELECT a.N + b.N * 10 + 1 n
          FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
               (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
          ORDER BY n
        ) numbers ON CHAR_LENGTH(analysis) - CHAR_LENGTH(REPLACE(analysis, ',', '')) >= numbers.n - 1
        WHERE analysis LIKE '%Matching Keywords:%'
      ) keywords
      WHERE keyword != ''
      GROUP BY keyword
      ORDER BY frequency DESC
      LIMIT ?
    `, [resultLimit]);

    res.json({
      skills: rows
    });
  } catch (error: any) {
    console.error('Error getting top skills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get candidate profile for swiping
router.get('/candidate-profile/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const candidateId = parseInt(req.params.id);
    console.log('Fetching profile for candidate:', candidateId);
    
    // Validate user exists and is an employee
    const [userCheck] = await pool.execute(`
      SELECT id, role FROM users WHERE id = ?
    `, [candidateId]);

    if (!userCheck || (userCheck as any[]).length === 0) {
      return res.status(404).json({ 
        error: 'User not found',
        details: 'No user found with the given ID'
      });
    }

    const user = (userCheck as any[])[0];
    if (user.role !== 'employee') {
      return res.status(400).json({ 
        error: 'Invalid user type',
        details: 'The specified user is not an employee'
      });
    }

    // Get detailed candidate profile with resume score
    const [rows] = await pool.execute(`
      SELECT 
        r.id as resume_id,
        r.employee_id,
        r.file_url,
        ars.score,
        ars.analysis,
        ars.scored_at,
        p.first_name,
        p.last_name,
        p.avatar_url,
        p.title,
        p.skills,
        p.experience_years,
        p.education,
        p.linkedin_url,
        p.github_url,
        p.bio,
        p.preferred_location,
        p.preferred_job_type,
        p.preferred_work_environment,
        u.email as employee_email
      FROM resumes r
      INNER JOIN users u ON r.employee_id = u.id
      INNER JOIN profiles p ON u.id = p.user_id
      INNER JOIN ai_resume_scores ars ON r.id = ars.resume_id
      WHERE r.employee_id = ?
    `, [candidateId]);

    console.log('Found profile rows:', (rows as any[]).length);

    if (!rows || (rows as any[]).length === 0) {
      console.log('No profile found for candidate:', candidateId);
      return res.status(404).json({ 
        error: 'Candidate profile not found',
        details: 'No matching profile found for the given candidate ID'
      });
    }

    const profile = (rows as any[])[0];
    
    res.json({
      resume_id: profile.resume_id,
      employee_id: profile.employee_id,
      employee_name: `${profile.first_name} ${profile.last_name}`,
      employee_email: profile.employee_email,
      avatar_url: profile.avatar_url,
      title: profile.title,
      skills: JSON.parse(profile.skills || '[]'),
      experience_years: profile.experience_years,
      education: profile.education,
      linkedin_url: profile.linkedin_url,
      github_url: profile.github_url,
      bio: profile.bio,
      preferred_location: profile.preferred_location,
      preferred_job_type: profile.preferred_job_type,
      preferred_work_environment: profile.preferred_work_environment,
      score: profile.score,
      match_percentage: (profile.score * 100).toFixed(2) + '%',
      analysis: profile.analysis,
      scored_at: profile.scored_at
    });
  } catch (error: any) {
    console.error('Error fetching candidate profile:', error);
    console.error('Error details:', {
      message: error.message,
      sql: error.sql,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Handle employer swipe action
router.post('/swipe', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { candidate_id, action } = req.body;
    const employer_id = (req as any).user.id; // Assuming user ID is stored in the token

    if (!candidate_id || !action || !['like', 'pass'].includes(action)) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Record the swipe action
    await pool.execute(`
      INSERT INTO employer_swipes (employer_id, candidate_id, action, swiped_at)
      VALUES (?, ?, ?, NOW())
    `, [employer_id, candidate_id, action]);

    // If it's a like, check for a match
    if (action === 'like') {
      const [matchCheck] = await pool.execute(`
        SELECT id FROM matches 
        WHERE (employer_id = ? AND candidate_id = ?)
        OR (employer_id = ? AND candidate_id = ?)
      `, [employer_id, candidate_id, candidate_id, employer_id]);

      if ((matchCheck as any[]).length > 0) {
        // Create a match
        await pool.execute(`
          INSERT INTO matches (employer_id, candidate_id, matched_at)
          VALUES (?, ?, NOW())
        `, [employer_id, candidate_id]);

        res.json({ 
          success: true, 
          matched: true,
          message: 'It\'s a match!' 
        });
        return;
      }
    }

    res.json({ 
      success: true, 
      matched: false,
      message: action === 'like' ? 'Like recorded' : 'Pass recorded' 
    });
  } catch (error: any) {
    console.error('Error processing swipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 
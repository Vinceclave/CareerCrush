import { Router, Request, Response } from 'express';
import { ResumeModel, AIResumeScore } from '../models/Resume';
import { authenticateToken } from '../middleware/auth';
import pool from '../config/database';

const router = Router();

// Dummy data for testing
const dummyCandidates = [
  {
    resume_id: 1,
    employee_id: 101,
    employee_name: "John Doe",
    employee_email: "john.doe@example.com",
    avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
    title: "Senior Software Engineer",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
    experience_years: 5,
    education: "BS Computer Science, Stanford University",
    linkedin_url: "https://linkedin.com/in/johndoe",
    preferred_location: "San Francisco, CA",
    preferred_job_type: "Full-time",
    score: 0.95,
    analysis: "Strong match for senior developer position. Excellent React and Node.js experience.",
    scored_at: "2024-03-15T10:30:00Z",
    match_percentage: "95%"
  },
  {
    resume_id: 2,
    employee_id: 102,
    employee_name: "Jane Smith",
    employee_email: "jane.smith@example.com",
    avatar_url: "https://randomuser.me/api/portraits/women/2.jpg",
    title: "Data Scientist",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Data Analysis"],
    experience_years: 3,
    education: "MS Data Science, MIT",
    linkedin_url: "https://linkedin.com/in/janesmith",
    preferred_location: "New York, NY",
    preferred_job_type: "Full-time",
    score: 0.92,
    analysis: "Excellent match for data science role. Strong ML background.",
    scored_at: "2024-03-15T11:15:00Z",
    match_percentage: "92%"
  },
  {
    resume_id: 3,
    employee_id: 103,
    employee_name: "Michael Johnson",
    employee_email: "michael.johnson@example.com",
    avatar_url: "https://randomuser.me/api/portraits/men/3.jpg",
    title: "Product Manager",
    skills: ["Product Strategy", "Agile", "User Research", "Data Analysis", "Communication"],
    experience_years: 4,
    education: "MBA, Harvard Business School",
    linkedin_url: "https://linkedin.com/in/michaeljohnson",
    preferred_location: "Seattle, WA",
    preferred_job_type: "Full-time",
    score: 0.88,
    analysis: "Good match for product management role. Strong business background.",
    scored_at: "2024-03-15T12:00:00Z",
    match_percentage: "88%"
  },
  {
    resume_id: 4,
    employee_id: 104,
    employee_name: "Emily Davis",
    employee_email: "emily.davis@example.com",
    avatar_url: "https://randomuser.me/api/portraits/women/4.jpg",
    title: "UX Designer",
    skills: ["UI/UX Design", "Figma", "User Research", "Prototyping", "Design Systems"],
    experience_years: 3,
    education: "BS Design, Rhode Island School of Design",
    linkedin_url: "https://linkedin.com/in/emilydavis",
    preferred_location: "Austin, TX",
    preferred_job_type: "Full-time",
    score: 0.85,
    analysis: "Strong match for UX design position. Excellent portfolio.",
    scored_at: "2024-03-15T13:30:00Z",
    match_percentage: "85%"
  },
  {
    resume_id: 5,
    employee_id: 105,
    employee_name: "David Wilson",
    employee_email: "david.wilson@example.com",
    avatar_url: "https://randomuser.me/api/portraits/men/5.jpg",
    title: "DevOps Engineer",
    skills: ["Kubernetes", "Docker", "AWS", "CI/CD", "Terraform"],
    experience_years: 4,
    education: "BS Computer Engineering, Georgia Tech",
    linkedin_url: "https://linkedin.com/in/davidwilson",
    preferred_location: "Remote",
    preferred_job_type: "Full-time",
    score: 0.82,
    analysis: "Good match for DevOps role. Strong infrastructure experience.",
    scored_at: "2024-03-15T14:45:00Z",
    match_percentage: "82%"
  }
];

const dummySkills = [
  { keyword: "JavaScript", frequency: 42 },
  { keyword: "React", frequency: 38 },
  { keyword: "Python", frequency: 35 },
  { keyword: "Node.js", frequency: 32 },
  { keyword: "AWS", frequency: 28 },
  { keyword: "TypeScript", frequency: 25 },
  { keyword: "Machine Learning", frequency: 22 },
  { keyword: "SQL", frequency: 20 },
  { keyword: "Docker", frequency: 18 },
  { keyword: "Kubernetes", frequency: 15 }
];

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

    // Filter candidates based on minimum score
    const filteredCandidates = dummyCandidates.filter(candidate => candidate.score >= minScore);
    
    // Apply pagination
    const paginatedCandidates = filteredCandidates.slice(resultOffset, resultOffset + resultLimit);

    res.json({
      candidates: paginatedCandidates,
      pagination: {
        total: filteredCandidates.length,
        limit: resultLimit,
        offset: resultOffset
      }
    });
  } catch (error: any) {
    console.error('Error searching candidates:', error);
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
    const { limit = 10 } = req.query;
    const resultLimit = parseInt(limit as string);

    // Return dummy skills data
    res.json({
      skills: dummySkills.slice(0, resultLimit)
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
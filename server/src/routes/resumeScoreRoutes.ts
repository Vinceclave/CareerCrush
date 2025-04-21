import express from 'express';
import { getResumeScoresWithProfiles } from '../services/resumeScoreService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all resume scores with profiles (for employers)
router.get('/employer/resume-scores', authenticateToken, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied. Employers only.' });
    }

    const resumeScores = await getResumeScoresWithProfiles();
    res.json(resumeScores);
  } catch (error) {
    console.error('Error in resume scores route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 
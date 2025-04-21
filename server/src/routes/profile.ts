import express from 'express';
import { ProfileService } from '../services/ProfileService';
import { ResumeService } from '../services/ResumeService';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../client/uploads/resumes'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
});

// Get profile
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await ProfileService.getProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create profile
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profileId = await ProfileService.createProfile(userId, req.body);
    res.status(201).json({ 
      message: 'Profile created successfully',
      profileId 
    });
  } catch (error: any) {
    console.error('Create profile error:', error);
    if (error.message.includes('validation')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
router.put('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await ProfileService.updateProfile(userId, req.body);
    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('Update profile error:', error);
    if (error.message === 'Profile not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('validation')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload resume
router.post('/resume', authenticateToken, upload.single('resume'), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`;
    const resumeId = await ResumeService.uploadResume(userId, fileUrl);
    
    // Update profile with resume URL
    await ProfileService.updateProfile(userId, { resume_url: fileUrl });

    res.status(201).json({ 
      message: 'Resume uploaded successfully',
      resumeId,
      fileUrl
    });
  } catch (error: any) {
    console.error('Upload resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get resume
router.get('/resume', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const resumes = await ResumeService.getResumesByEmployeeId(userId);
    res.json(resumes);
  } catch (error: any) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete profile
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await ProfileService.deleteProfile(userId);
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 
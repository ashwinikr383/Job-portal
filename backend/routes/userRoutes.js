import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for resume uploads
const uploadsDir = path.join(__dirname, '../uploads/resumes');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.params.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedExts = ['.pdf', '.doc', '.docx'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   GET /api/users/all
// @desc    Get all users for the Admin Dashboard
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }

    // Exclude passwords and sort by newest first
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch operatives from the grid." });
  }
});

// @route   GET /api/users/banned
// @desc    Get all banned users for the Admin Dashboard
router.get('/banned', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }

    const bannedUsers = await User.find({ status: 'Banned' }).select('-password');
    res.json(bannedUsers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banned operatives.' });
  }
});

// @route   PATCH /api/users/:id/resume
// @desc    Update seeker resume text
router.patch('/:id/resume', async (req, res) => {
  try {
    const { resumeText } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Operative not found." });

    user.resume.text = resumeText || '';
    await user.save();

    res.json({ 
      message: "Resume updated successfully.", 
      resume: user.resume 
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update the resume." });
  }
});

// @route   POST /api/users/:id/resume/upload
// @desc    Upload a resume file (PDF or Word document)
router.post('/:id/resume/upload', upload.single('resumeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      // Delete uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Operative not found." });
    }

    // Delete old resume file if it exists
    if (user.resume.file && user.resume.file.filepath) {
      const oldFilePath = path.join(__dirname, '../uploads/resumes', path.basename(user.resume.file.filepath));
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update user resume with new file info
    user.resume.file = {
      filename: req.file.originalname,
      filepath: `/uploads/resumes/${req.file.filename}`,
      uploadDate: new Date(),
      fileType: req.file.mimetype
    };

    await user.save();

    res.json({ 
      message: "Resume file uploaded successfully.", 
      resume: user.resume 
    });
  } catch (err) {
    // Delete uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: err.message || "Failed to upload resume file." });
  }
});

// @route   DELETE /api/users/:id/resume/file
// @desc    Delete a resume file
router.delete('/:id/resume/file', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Operative not found." });

    if (user.resume.file && user.resume.file.filepath) {
      const filePath = path.join(__dirname, '../uploads/resumes', path.basename(user.resume.file.filepath));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      user.resume.file = {
        filename: null,
        filepath: null,
        uploadDate: null,
        fileType: null
      };

      await user.save();
      res.json({ message: "Resume file deleted successfully." });
    } else {
      res.status(404).json({ error: "No resume file found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete resume file." });
  }
});

// @route   DELETE /api/users/:id
// @desc    Permanently remove a user (Ban)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "Operative not found." });
    
    res.json({ message: "Operative purged from the system.", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Decline: Could not delete user." });
  }
});

// @route   PATCH /api/users/:id/verify
// @desc    Toggle verification status (Real-time)
router.patch('/:id/verify', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Entity not found." });

    user.isVerified = !user.isVerified;
    user.status = user.isVerified ? 'Verified' : 'Pending';
    await user.save();

    res.json({ 
      message: `Status updated for ${user.name}`, 
      isVerified: user.isVerified,
      status: user.status
    });
  } catch (err) {
    res.status(500).json({ error: "Internal link failure: Verification failed." });
  }
});

// @route   PATCH /api/users/:id/status
// @desc    Update user status (ban/unban)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (!['Admin', 'Employer'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges.' });
    }

    const { status } = req.body;
    const validStatuses = ['Active', 'Banned', 'Pending', 'Verified'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Operative not found.' });

    user.status = status;
    if (status === 'Active' && user.isVerified) {
      user.status = 'Verified';
    }
    await user.save();

    res.json({ message: `Operative status set to ${user.status}.`, user: user.toObject() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update operative status.' });
  }
});

export default router;
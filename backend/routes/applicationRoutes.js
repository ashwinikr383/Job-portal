import express from 'express';
import Application from '../models/Application.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/applications/user/:id
// @desc    Get all applications for a seeker
router.get('/user/:id', async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.params.id })
      .populate({ path: 'job', select: 'title company location salary posted postedBy' })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your applications.' });
  }
});

// @route   GET /api/applications/job/:id
// @desc    Get all applicants for a job
router.get('/job/:id', async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.id })
      .populate({ path: 'applicant', select: 'name email role status' })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch job applicants.' });
  }
});

// @route   PATCH /api/applications/:id/status
// @desc    Update an application's review status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (!['Employer', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges.' });
    }

    const { status } = req.body;
    const validStatuses = ['Pending Review', 'Interviewing', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid application status.' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    application.status = status;
    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate({ path: 'applicant', select: 'name email role status' })
      .populate({ path: 'job', select: 'title company location salary' });

    res.json({ message: 'Application status updated.', application: updatedApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application status.' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Remove a submitted application
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!['Employer', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges.' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application removed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove application.' });
  }
});

export default router;

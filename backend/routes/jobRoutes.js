import express from 'express';
import Job from '../models/Job.js'; // Ensure you have a Job model created
import Application from '../models/Application.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/jobs/create
// @desc    Deploy a new job contract
router.post('/create', async (req, res) => {
  try {
    const { title, company, location, salary, description, postedBy, employerId } = req.body;

    const newJob = new Job({
      title,
      company,
      location,
      salary,
      description,
      postedBy: postedBy || employerId // Accept both field names
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ error: "Failed to deploy contract to the grid." });
  }
});

// @route   POST /api/jobs/apply
// @desc    Apply to a job
router.post('/apply', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;
    const applicantId = req.user._id;

    if (!jobId) {
      return res.status(400).json({ error: 'Missing jobId.' });
    }

    if (req.user.role !== 'Seeker') {
      return res.status(403).json({ error: 'Only seekers may apply for jobs.' });
    }

    if (req.user.status === 'Banned') {
      return res.status(403).json({ error: 'Banned operatives cannot apply.' });
    }

    const existingApplication = await Application.findOne({ job: jobId, applicant: applicantId });
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job.' });
    }

    const application = new Application({
      job: jobId,
      applicant: applicantId
    });

    await application.save();
    const applicantCount = await Application.countDocuments({ job: jobId });

    res.status(201).json({ message: 'Application created.', applications: applicantCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

// @route   GET /api/jobs/employer/:id/applications
// @desc    Get employer jobs with application counts
router.get('/employer/:id/applications', async (req, res) => {
  try {
    const employerId = req.params.id;
    const jobs = await Job.find({ postedBy: employerId }).sort({ createdAt: -1 });
    const counts = await Application.aggregate([
      { $match: { job: { $in: jobs.map(job => job._id) } } },
      { $group: { _id: '$job', count: { $sum: 1 } } }
    ]);

    const jobsWithCounts = jobs.map((job) => {
      const countEntry = counts.find(item => item._id.toString() === job._id.toString());
      return { ...job.toObject(), applications: countEntry ? countEntry.count : 0 };
    });

    res.json(jobsWithCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch employer job applications.' });
  }
});

// @route   GET /api/jobs/all
router.get('/all', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Grid failure: cannot fetch jobs." });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found." });

    const applications = await Application.countDocuments({ job: job._id });
    const jobData = job.toObject();
    jobData.applications = applications;

    res.json(jobData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch job." });
  }
});

export default router;
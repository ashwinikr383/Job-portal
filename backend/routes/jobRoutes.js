import express from 'express';
import Job from '../models/Job.js'; // Ensure you have a Job model created

const router = express.Router();

// @route   POST /api/jobs/create
// @desc    Deploy a new job contract
router.post('/create', async (req, res) => {
  try {
    const { title, company, location, salary, description, employerId } = req.body;

    const newJob = new Job({
      title,
      company,
      location,
      salary,
      description,
      postedBy: employerId // Link the job to the employer
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ error: "Failed to deploy contract to the grid." });
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

export default router;
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/users/all
// @desc    Get all users for the Admin Dashboard
router.get('/all', async (req, res) => {
  try {
    // Exclude passwords and sort by newest first
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch operatives from the grid." });
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
router.patch('/:id/verify', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Entity not found." });

    // Toggle status: if true -> false, if false -> true
    user.isVerified = !user.isVerified;
    await user.save();

    res.json({ 
      message: `Status updated for ${user.name}`, 
      isVerified: user.isVerified 
    });
  } catch (err) {
    res.status(500).json({ error: "Internal link failure: Verification failed." });
  }
});

export default router;
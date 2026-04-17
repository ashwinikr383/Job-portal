import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vicejobs_secret_key_2026';

// --- POST: REGISTER A NEW USER ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '[ ERROR ] Operative already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isVerified = role === 'Admin' ? true : false;
    const status = role === 'Admin' ? 'Verified' : 'Pending';

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      companyName: role === 'Employer' ? companyName : undefined,
      isVerified,
      status
    });

    await newUser.save();
    res.status(201).json({ message: '[ SUCCESS ] User successfully registered to the mainframe!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '[ ERROR ] Internal Server Error during registration.' });
  }
});

// --- POST: LOGIN USER ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '[ ERROR ] Operative not found in mainframe.' });
    }

    if (user.status === 'Banned') {
      return res.status(403).json({ message: '[ ERROR ] Access blocked: account is banned.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '[ ERROR ] Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: '[ SUCCESS ] Access granted to the mainframe!',
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        resume: user.resume || '',
        isVerified: user.isVerified,
        status: user.status
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '[ ERROR ] Login sequence failed.' });
  }
});

// --- GET: FETCH ALL USERS ---
router.get('/users', async (req, res) => {
  try {
    // .select('-password') tells MongoDB: "Give me everything EXCEPT the password"
    const users = await User.find().select('-password');
    
    res.status(200).json({
      message: '[ SUCCESS ] Data retrieved from mainframe.',
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '[ ERROR ] Could not fetch user data.' });
  }
});

export default router;
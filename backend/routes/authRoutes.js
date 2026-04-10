import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

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

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      companyName: role === 'Employer' ? companyName : undefined 
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '[ ERROR ] Invalid credentials.' });
    }

    res.status(200).json({
      message: '[ SUCCESS ] Access granted to the mainframe!',
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
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
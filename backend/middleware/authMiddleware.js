import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vicejobs_secret_key_2026';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Operative not found.' });
    }
    if (user.status === 'Banned') {
      return res.status(403).json({ error: 'Access blocked: Account is banned.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware failure:', error);
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export default authMiddleware;

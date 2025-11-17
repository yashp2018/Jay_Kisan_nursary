// file: controllers/authController.js  (or wherever loginUser lives)
import bcrypt from 'bcryptjs';               // <-- CRITICAL: import bcrypt
import User from '../models/User.js';
import { generateToken } from '../utils/token.js';

export const loginUser = async (req, res) => {
  const { staffId, password } = req.body;
  console.log('Login Request:', staffId, password);

  try {
    if (!staffId || !password) {
      return res.status(400).json({ message: 'Missing staffId or password' });
    }

    const user = await User.findOne({ staffId }).exec();
    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // user exists — now compare safely
    if (!user.password) {
      console.error('User has no password hash stored');
      return res.status(500).json({ message: 'Server error' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
    console.log('Generated token:', token);

    return res.json({
      _id: user._id,
      staffId: user.staffId,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

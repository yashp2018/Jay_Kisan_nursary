// routes/userRoutes.js
import express from 'express';
import { loginUser } from '../controllers/userController.js';
import User from '../models/User.js';

const router = express.Router();

// Login route
router.post('/login', loginUser);

// =============================
// 🔍 DEBUG ROUTE (view users)
// =============================
router.get('/debug-users', async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// =============================

export default router;

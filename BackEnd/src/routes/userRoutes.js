import express from 'express';
import { loginUser } from '../controllers/userController.js';
import User from '../models/User.js';   // <-- ADD THIS

const router = express.Router();

router.post('/login', loginUser);

// ==========================
// 🔍 TEMP DEBUG ENDPOINT
// ==========================
router.get('/debug-users', async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// ==========================

export default router;

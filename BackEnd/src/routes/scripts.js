import express from 'express';
import generateSowingSchedules from '../scripts/backfillSchedules.js';

const router = express.Router();

// POST /api/scripts/backfillSchedules
router.post('/backfillSchedules', async (req, res) => {
  try {
    const result = await generateSowingSchedules();
    res.json(result);
  } catch (error) {
    console.error('Backfill schedules error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate sowing schedules',
      error: error.message 
    });
  }
});

export default router;
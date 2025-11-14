// src/routes/scripts.js
import express from 'express';
import generateSowingSchedules from '../scripts/backfillSchedules.js';

const router = express.Router();

// Route to execute backfillSchedules script
router.post('/backfillSchedules', async (req, res) => {
  try {
    console.log('Generating sowing schedules...');
    const result = await generateSowingSchedules();
    
    res.json({
      success: true,
      message: result.message,
      data: {
        schedulesCreated: result.schedulesCreated,
        schedulesUpdated: result.schedulesUpdated,
        totalBookings: result.totalBookings
      }
    });
  } catch (error) {
    console.error('Error in backfillSchedules route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to generate sowing schedules'
    });
  }
});

export default router;
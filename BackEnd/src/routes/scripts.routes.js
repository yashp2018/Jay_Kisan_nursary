const express = require("express");
const router = express.Router();
const backfillSchedules = require("../scripts/backfillSchedules");

router.post("/backfillSchedules", async (req, res) => {
  try {
    const result = await backfillSchedules(); // <-- run script like terminal
    res.json({
      success: true,
      message: "Sowing schedules generated successfully!",
      result
    });
  } catch (error) {
    console.error("Backfill script error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate schedules",
      error: error.message
    });
  }
});

module.exports = router;

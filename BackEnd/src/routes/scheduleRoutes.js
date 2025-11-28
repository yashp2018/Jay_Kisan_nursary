// src/routes/schedules.js
import express from "express";
import {
  aggregateSchedule,
  getOngoingAndUpcomingSchedules,
  updateSchedule,
  getBookingsForVariety
} from "../controllers/scheduleController.js";
import { backfillSchedules } from "../controllers/scriptsController.js";
import { protect, staffOrAdmin } from "../middleware/authMiddleware.js"; // <-- adjust path if needed

const router = express.Router();

// All routes protected and accessible by staff OR admin
router.get("/", protect, staffOrAdmin, getOngoingAndUpcomingSchedules);            // GET /api/schedules
router.patch("/update", protect, staffOrAdmin, updateSchedule);                    // PATCH /api/schedules/update
router.get("/:id/aggregate", protect, staffOrAdmin, aggregateSchedule);            // GET /api/schedules/:id/aggregate

// GET /api/schedules/variety/bookings
router.get("/variety/bookings", protect, staffOrAdmin, getBookingsForVariety);

// Backfill script endpoint (also staff/admin)
router.post("/backfill", protect, staffOrAdmin, backfillSchedules);                // POST /api/schedules/backfill

export default router;

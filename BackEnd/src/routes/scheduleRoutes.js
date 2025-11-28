import express from "express";
import { aggregateSchedule, getOngoingAndUpcomingSchedules, updateSchedule, getBookingsForVariety } from "../controllers/scheduleController.js";
import { backfillSchedules } from "../controllers/scriptsController.js";

const router = express.Router();
router.get("/", getOngoingAndUpcomingSchedules);            // GET /api/schedules
router.patch("/update", updateSchedule);                    // PATCH /api/schedules/update
router.get("/:id/aggregate", aggregateSchedule);            // GET /api/schedules/:id/aggregate
        // GET /schedules/bookings?...
router.get("/variety/bookings", getBookingsForVariety);
router.post("/backfill", backfillSchedules);                // POST /api/schedules/backfill




export default router;

//cd BackEnd; node src/scripts/backfillSchedules.js

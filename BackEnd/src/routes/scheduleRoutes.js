// BackEnd/src/routes/scheduleRoutes.js
import express from "express";
import {
  aggregateSchedule,
  getOngoingAndUpcomingSchedules,
  updateSchedule,
  getBookingsForVariety,
  // Note: other controller functions (getBookingsBySchedule, getScheduleById) may or may not exist.
} from "../controllers/scheduleController.js";

const router = express.Router();

// --- Public endpoints ---
// GET /api/schedules
router.get("/", getOngoingAndUpcomingSchedules);

// PATCH /api/schedules/update
router.patch("/update", updateSchedule);

// Static route for variety bookings (kept for backwards compatibility)
// GET /api/schedules/variety/bookings
router.get("/variety/bookings", getBookingsForVariety);

/**
 * NEW: GET /api/schedules/bookings
 * Accepts query params like scheduleId, groupId, varietyId (as your frontend is calling).
 * This route will:
 *  - if varietyId present and controller has getBookingsForVariety -> call it
 *  - else if controller has getBookingsBySchedule -> call it
 *  - else return 501 telling developer what to implement
 */
router.get("/bookings", async (req, res) => {
  try {
    const { scheduleId, groupId, varietyId } = req.query;

    // dynamic import so we can detect available controller functions
    const controllerMod = await import("../controllers/scheduleController.js");

    // If user requested variety-specific bookings and controller supports it, call it
    if (varietyId && typeof controllerMod.getBookingsForVariety === "function") {
      // expect controller to read req.query.varietyId, etc.
      return controllerMod.getBookingsForVariety(req, res);
    }

    // If there is a controller function specifically for schedule-based bookings, call it
    if (typeof controllerMod.getBookingsBySchedule === "function") {
      // expect controller to read req.query.scheduleId, req.query.groupId, ...
      return controllerMod.getBookingsBySchedule(req, res);
    }

    // If none exist, provide a helpful response to implementers
    return res.status(501).json({
      message:
        "No appropriate controller function found to handle GET /api/schedules/bookings. " +
        "Please implement and export one of the following in scheduleController.js:\n\n" +
        "1) export async function getBookingsBySchedule(req, res) { /* uses req.query.scheduleId / groupId */ }\n" +
        "OR\n" +
        "2) export async function getBookingsForVariety(req, res) { /* uses req.query.varietyId */ }\n\n" +
        "Currently available controller exports: " +
        Object.keys(controllerMod).join(", "),
      hint: "If you already have a function but with a different name, either rename it or add a small wrapper function here that calls it.",
    });
  } catch (error) {
    console.error("Error in GET /api/schedules/bookings route:", error);
    return res.status(500).json({
      message: "Server error while handling /api/schedules/bookings",
      error: error.message,
    });
  }
});

// GET /api/schedules/:id/aggregate
router.get("/:id/aggregate", aggregateSchedule);

/**
 * GET /api/schedules/:id
 * If your controller exports getScheduleById, it will be called.
 * Otherwise returns 501 explaining what to implement.
 */
router.get("/:id", async (req, res) => {
  try {
    const controllerMod = await import("../controllers/scheduleController.js");

    if (typeof controllerMod.getScheduleById === "function") {
      return controllerMod.getScheduleById(req, res);
    }

    return res.status(501).json({
      message:
        "getScheduleById is not implemented in scheduleController.js. " +
        "Please add and export an async function `getScheduleById(req, res)` that fetches a schedule by ID.",
      hint: "Example: export async function getScheduleById(req, res) { const { id } = req.params; ... }",
    });
  } catch (error) {
    console.error("Error in GET /api/schedules/:id route:", error);
    return res.status(500).json({
      message: "Server error while handling schedule request",
      error: error.message,
    });
  }
});

export default router;

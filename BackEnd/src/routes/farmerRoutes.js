// farmer routes
import express from "express";
import {
  createFarmer,
  getNewFarmers,
  getPendingFarmers,
 
  getSowingFarmers,
  updateFarmerStatus,
  getAllFarmers,
  getFarmerByRegistration,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
} from "../controllers/farmerController.js";
import { protect, staffOrAdmin } from "../middleware/authMiddleware.js";
import { verifyFarmerByRegistrationNo } from "../controllers/farmerController.js";
const router = express.Router();

// Protect these routes (only staff/admin)
router.use(protect, staffOrAdmin);

// Create new farmer
router.post("/", createFarmer);

// Default list (keeps backward compatibility)
router.get("/", getNewFarmers);

// Full list (searchable & paginated)
router.get("/all-farmers", getAllFarmers);
router.get("/verify/:registrationNo", verifyFarmerByRegistrationNo);
router.get('/registration/:registrationNo', getFarmerByRegistration);
// Filtered endpoints
router.get("/new", getNewFarmers);
router.get("/sowing", getSowingFarmers);
router.get("/pending", getPendingFarmers);

// Update status (patch)
router.patch("/:id/status", updateFarmerStatus);

// CRUD for single farmer
router.get("/:id", getFarmerById);
router.put("/:id", updateFarmer);
router.delete("/:id", deleteFarmer);

export default router;

import express from "express";
import { protect, adminOnly, } from "../middleware/authMiddleware.js";
import { createNutrientStock, listNutrientStock, updateNutrientStock  } from "../controllers/nutrientStockController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", listNutrientStock);
router.post("/", createNutrientStock);
router.put("/:id", updateNutrientStock);

export default router;

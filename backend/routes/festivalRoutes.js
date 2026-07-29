import express from "express";
import {
  getFestivals,
  createFestival,
  updateFestival,
  deleteFestival,
} from "../controllers/festivalController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getFestivals);
router.post("/", protect, requireRole("superadmin", "editor"), createFestival);
router.put("/:id", protect, requireRole("superadmin", "editor"), updateFestival);
router.delete("/:id", protect, requireRole("superadmin"), deleteFestival);

export default router;

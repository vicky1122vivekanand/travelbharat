import express from "express";
import {
  getPlaces,
  getPlaceBySlug,
  createPlace,
  updatePlace,
  deletePlace,
  getStats,
} from "../controllers/placeController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPlaces);
router.get("/stats/summary", protect, getStats);
router.get("/:slug", getPlaceBySlug);
router.post("/", protect, requireRole("superadmin", "editor"), createPlace);
router.put("/:id", protect, requireRole("superadmin", "editor"), updatePlace);
router.delete("/:id", protect, requireRole("superadmin"), deletePlace);

export default router;

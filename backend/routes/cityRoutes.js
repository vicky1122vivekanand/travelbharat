import express from "express";
import { getCities, createCity, updateCity, deleteCity } from "../controllers/cityController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCities);
router.post("/", protect, requireRole("superadmin", "editor"), createCity);
router.put("/:id", protect, requireRole("superadmin", "editor"), updateCity);
router.delete("/:id", protect, requireRole("superadmin"), deleteCity);

export default router;

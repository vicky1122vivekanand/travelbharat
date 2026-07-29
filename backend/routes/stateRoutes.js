import express from "express";
import {
  getStates,
  getStateBySlug,
  createState,
  updateState,
  deleteState,
} from "../controllers/stateController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getStates);
router.get("/:slug", getStateBySlug);
router.post("/", protect, requireRole("superadmin", "editor"), createState);
router.put("/:id", protect, requireRole("superadmin", "editor"), updateState);
router.delete("/:id", protect, requireRole("superadmin"), deleteState);

export default router;

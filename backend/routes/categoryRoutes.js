import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, requireRole("superadmin", "editor"), createCategory);
router.put("/:id", protect, requireRole("superadmin", "editor"), updateCategory);
router.delete("/:id", protect, requireRole("superadmin"), deleteCategory);

export default router;

import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  getWishlist,
  setWishlist,
  getTripPlan,
  setTripPlan,
} from "../controllers/userController.js";
import { protectUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protectUser, getMe);

router.get("/wishlist", protectUser, getWishlist);
router.put("/wishlist", protectUser, setWishlist);

router.get("/trip-plan", protectUser, getTripPlan);
router.put("/trip-plan", protectUser, setTripPlan);

export default router;

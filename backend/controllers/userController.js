import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Wishlist from "../models/Wishlist.js";
import TripPlan from "../models/TripPlan.js";

const signToken = (id) =>
  jwt.sign({ id, kind: "user" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

// @desc  Register a new user (traveler / student / researcher)
// @route POST /api/users/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "An account with this email already exists" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Login user
// @route POST /api/users/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: signToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    next(err);
  }
};

// @desc  Get logged-in user's profile
// @route GET /api/users/me
export const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc  Get the logged-in user's wishlist
// @route GET /api/users/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: "places",
      populate: [
        { path: "state", select: "name slug" },
        { path: "city", select: "name slug" },
        { path: "categories", select: "name slug" },
      ],
    });
    res.json(wishlist?.places || []);
  } catch (err) {
    next(err);
  }
};

// @desc  Replace the logged-in user's wishlist (full sync from client)
// @route PUT /api/users/wishlist
export const setWishlist = async (req, res, next) => {
  try {
    const { placeIds } = req.body;
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { places: placeIds || [] },
      { upsert: true, new: true }
    );
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
};

// @desc  Get the logged-in user's trip plan
// @route GET /api/users/trip-plan
export const getTripPlan = async (req, res, next) => {
  try {
    const plan = await TripPlan.findOne({ user: req.user._id }).populate({
      path: "days.places",
      populate: [
        { path: "state", select: "name slug" },
        { path: "city", select: "name slug" },
      ],
    });
    res.json(plan?.days || [{ label: "Day 1", places: [] }]);
  } catch (err) {
    next(err);
  }
};

// @desc  Replace the logged-in user's trip plan (full sync from client)
// @route PUT /api/users/trip-plan
export const setTripPlan = async (req, res, next) => {
  try {
    const { days } = req.body;
    const plan = await TripPlan.findOneAndUpdate(
      { user: req.user._id },
      { days: days || [] },
      { upsert: true, new: true }
    );
    res.json(plan);
  } catch (err) {
    next(err);
  }
};

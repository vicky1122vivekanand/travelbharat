import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @desc  Register a new admin (superadmin only, or first-run bootstrap)
// @route POST /api/auth/register
export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ name, email, password, role });
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: signToken(admin._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Login admin
// @route POST /api/auth/login
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: signToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    next(err);
  }
};

// @desc  Get logged-in admin profile
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.admin);
};

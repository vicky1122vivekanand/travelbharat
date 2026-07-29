import State from "../models/State.js";
import TouristPlace from "../models/TouristPlace.js";

// @desc  Get all states (with optional region filter)
// @route GET /api/states
export const getStates = async (req, res, next) => {
  try {
    const filter = { isPublished: true };
    if (req.query.region) filter.region = req.query.region;

    const states = await State.find(filter).sort({ name: 1 });
    res.json(states);
  } catch (err) {
    next(err);
  }
};

// @desc  Get single state by slug, including a place count
// @route GET /api/states/:slug
export const getStateBySlug = async (req, res, next) => {
  try {
    const state = await State.findOne({ slug: req.params.slug });
    if (!state) return res.status(404).json({ message: "State not found" });

    const placeCount = await TouristPlace.countDocuments({ state: state._id, isPublished: true });
    res.json({ ...state.toObject(), placeCount });
  } catch (err) {
    next(err);
  }
};

// @desc  Create a state (admin)
// @route POST /api/states
export const createState = async (req, res, next) => {
  try {
    const state = await State.create(req.body);
    res.status(201).json(state);
  } catch (err) {
    next(err);
  }
};

// @desc  Update a state (admin)
// @route PUT /api/states/:id
export const updateState = async (req, res, next) => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!state) return res.status(404).json({ message: "State not found" });
    res.json(state);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a state (admin)
// @route DELETE /api/states/:id
export const deleteState = async (req, res, next) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) return res.status(404).json({ message: "State not found" });
    res.json({ message: "State removed" });
  } catch (err) {
    next(err);
  }
};

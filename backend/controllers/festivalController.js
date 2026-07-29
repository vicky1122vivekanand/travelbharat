import Festival from "../models/Festival.js";
import State from "../models/State.js";

// @desc  Get festivals, optionally filtered by state slug or month
// @route GET /api/festivals?state=rajasthan&month=October
export const getFestivals = async (req, res, next) => {
  try {
    const filter = { isPublished: true };

    if (req.query.state) {
      const state = await State.findOne({ slug: req.query.state });
      if (!state) return res.json([]);
      filter.state = state._id;
    }
    if (req.query.month) filter.month = req.query.month;

    const festivals = await Festival.find(filter)
      .populate("state", "name slug")
      .sort({ month: 1 });
    res.json(festivals);
  } catch (err) {
    next(err);
  }
};

// @desc  Create festival (admin)
// @route POST /api/festivals
export const createFestival = async (req, res, next) => {
  try {
    const festival = await Festival.create(req.body);
    res.status(201).json(festival);
  } catch (err) {
    next(err);
  }
};

// @desc  Update festival (admin)
// @route PUT /api/festivals/:id
export const updateFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!festival) return res.status(404).json({ message: "Festival not found" });
    res.json(festival);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete festival (admin)
// @route DELETE /api/festivals/:id
export const deleteFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findByIdAndDelete(req.params.id);
    if (!festival) return res.status(404).json({ message: "Festival not found" });
    res.json({ message: "Festival removed" });
  } catch (err) {
    next(err);
  }
};

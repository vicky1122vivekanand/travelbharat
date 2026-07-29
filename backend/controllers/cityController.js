import City from "../models/City.js";
import State from "../models/State.js";

// @desc  Get cities, optionally filtered by state slug
// @route GET /api/cities?state=kerala
export const getCities = async (req, res, next) => {
  try {
    const filter = { isPublished: true };
    if (req.query.state) {
      const state = await State.findOne({ slug: req.query.state });
      if (!state) return res.json([]);
      filter.state = state._id;
    }
    const cities = await City.find(filter).populate("state", "name slug").sort({ name: 1 });
    res.json(cities);
  } catch (err) {
    next(err);
  }
};

// @desc  Create city (admin)
// @route POST /api/cities
export const createCity = async (req, res, next) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json(city);
  } catch (err) {
    next(err);
  }
};

// @desc  Update city (admin)
// @route PUT /api/cities/:id
export const updateCity = async (req, res, next) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!city) return res.status(404).json({ message: "City not found" });
    res.json(city);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete city (admin)
// @route DELETE /api/cities/:id
export const deleteCity = async (req, res, next) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });
    res.json({ message: "City removed" });
  } catch (err) {
    next(err);
  }
};

import TouristPlace from "../models/TouristPlace.js";
import State from "../models/State.js";
import City from "../models/City.js";
import Category from "../models/Category.js";

// @desc  Get places with search, filters & pagination
// @route GET /api/places?state=&city=&category=&q=&page=&limit=
export const getPlaces = async (req, res, next) => {
  try {
    const { state, city, category, q, budget, suitableFor, season, duration, offers, hiddenGems, page = 1, limit = 12 } = req.query;
    const filter = { isPublished: true };

    if (state) {
      const stateDoc = await State.findOne({ slug: state });
      if (stateDoc) filter.state = stateDoc._id;
    }
    if (city) {
      const cityDoc = await City.findOne({ slug: city });
      if (cityDoc) filter.city = cityDoc._id;
    }
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) filter.categories = categoryDoc._id;
    }
    if (budget) filter.budgetLevel = budget;
    if (suitableFor) filter.suitableFor = suitableFor;
    if (season) filter.seasonalTags = season;
    if (duration) filter.recommendedDuration = { $regex: duration, $options: "i" };
    if (offers === "true") filter.isFeaturedOffer = true;
    if (hiddenGems === "true") filter.isHiddenGem = true;
    if (q) {
      filter.$text = { $search: q };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [places, total] = await Promise.all([
      TouristPlace.find(filter)
        .populate("state", "name slug")
        .populate("city", "name slug")
        .populate("categories", "name slug icon")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      TouristPlace.countDocuments(filter),
    ]);

    res.json({
      places,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single place by slug (also increments view count)
// @route GET /api/places/:slug
export const getPlaceBySlug = async (req, res, next) => {
  try {
    const place = await TouristPlace.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate("state", "name slug")
      .populate("city", "name slug")
      .populate("categories", "name slug icon")
      .populate("nearbyAttractions.place", "name slug shortDescription images");

    if (!place) return res.status(404).json({ message: "Tourist place not found" });
    res.json(place);
  } catch (err) {
    next(err);
  }
};

// @desc  Create a tourist place (admin)
// @route POST /api/places
export const createPlace = async (req, res, next) => {
  try {
    const place = await TouristPlace.create(req.body);
    res.status(201).json(place);
  } catch (err) {
    next(err);
  }
};

// @desc  Update a tourist place (admin)
// @route PUT /api/places/:id
export const updatePlace = async (req, res, next) => {
  try {
    const place = await TouristPlace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!place) return res.status(404).json({ message: "Tourist place not found" });
    res.json(place);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a tourist place (admin)
// @route DELETE /api/places/:id
export const deletePlace = async (req, res, next) => {
  try {
    const place = await TouristPlace.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: "Tourist place not found" });
    res.json({ message: "Tourist place removed" });
  } catch (err) {
    next(err);
  }
};

// @desc  Admin dashboard stats + KPI-relevant metrics
// @route GET /api/places/stats/summary
export const getStats = async (req, res, next) => {
  try {
    const [totalPlaces, totalStates, totalCities, totalCategories, unverified, verified, viewAgg, recentPlaces] = await Promise.all([
      TouristPlace.countDocuments(),
      State.countDocuments(),
      City.countDocuments(),
      Category.countDocuments(),
      TouristPlace.countDocuments({ isVerified: false }),
      TouristPlace.countDocuments({ isVerified: true }),
      TouristPlace.aggregate([{ $group: { _id: null, totalViews: { $sum: "$viewCount" } } }]),
      TouristPlace.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const totalViews = viewAgg[0]?.totalViews || 0;
    // Content accuracy rate KPI proxy: % of published places that are admin-verified
    const contentAccuracyRate = totalPlaces > 0 ? Math.round((verified / totalPlaces) * 100) : 0;

    res.json({
      totalPlaces,
      totalStates,
      totalCities,
      totalCategories,
      unverified,
      verified,
      contentAccuracyRate, // KPI: Content accuracy rate ≥ 95% target
      totalViews, // KPI proxy: engagement (view count is the available in-app metric)
      newPlacesLast30Days: recentPlaces,
    });
  } catch (err) {
    next(err);
  }
};

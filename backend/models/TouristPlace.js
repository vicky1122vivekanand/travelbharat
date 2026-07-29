import mongoose from "mongoose";

const touristPlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    shortDescription: { type: String, required: true, maxlength: 250 },
    description: { type: String, required: true },
    historicalSignificance: { type: String },

    bestTimeToVisit: { type: String }, // e.g. "October - March"
    timings: { type: String }, // e.g. "6:00 AM - 6:00 PM"
    entryFee: {
      indian: { type: String, default: "Free" },
      foreigner: { type: String, default: "Free" },
    },

    budgetLevel: { type: String, enum: ["Budget", "Mid-range", "Luxury"], default: "Mid-range" },
    recommendedDuration: { type: String, default: "Half day" }, // e.g. "Half day", "1 day", "2-3 days"
    suitableFor: [{ type: String, enum: ["Family", "Couple", "Solo", "Group"] }],
    seasonalTags: [{ type: String, enum: ["Summer", "Winter", "Monsoon", "Year-round"] }],

    isFeaturedOffer: { type: Boolean, default: false },
    offerText: { type: String }, // short promo line, e.g. "Free guided heritage walk this month"

    isHiddenGem: { type: Boolean, default: false },
    hiddenGemNote: { type: String },

    // Scalable hook for future booking integrations (phase two) — currently
    // just an optional outbound link, no payment processing happens here.
    externalBookingLink: { type: String }, // why it's worth discovering, e.g. "Only 4,000 visitors a year"

    nearbyHotels: [
      {
        name: { type: String, required: true },
        priceRange: { type: String }, // e.g. "₹1500 - ₹3000/night"
        distanceKm: { type: Number },
      },
    ],
    nearbyRestaurants: [
      {
        name: { type: String, required: true },
        cuisine: { type: String },
        priceRange: { type: String },
        distanceKm: { type: Number },
      },
    ],
    famousFood: [
      {
        name: { type: String, required: true },
        description: { type: String },
      },
    ],
    localTransport: [{ type: String }], // e.g. "Auto-rickshaw", "State bus", "Local taxi"

    location: {
      address: { type: String },
      mapLink: { type: String }, // Google Maps URL
      lat: { type: Number },
      lng: { type: Number },
    },

    nearbyAttractions: [
      {
        place: { type: mongoose.Schema.Types.ObjectId, ref: "TouristPlace" },
        distanceKm: { type: Number },
      },
    ],

    images: [
      {
        url: { type: String, required: true },
        caption: { type: String },
        isCover: { type: Boolean, default: false },
      },
    ],

    tags: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

touristPlaceSchema.index({ name: "text", shortDescription: "text", tags: "text" });
touristPlaceSchema.index({ state: 1, city: 1 });
touristPlaceSchema.index({ categories: 1 });

export default mongoose.model("TouristPlace", touristPlaceSchema);

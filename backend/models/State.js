import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, enum: ["State", "Union Territory"], default: "State" },
    region: { type: String }, // North, South, East, West, Northeast, Central
    capital: { type: String },
    description: { type: String },
    coverImage: { type: String },
    languages: [{ type: String }],
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    cuisine: [
      {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
      },
    ],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("State", stateSchema);

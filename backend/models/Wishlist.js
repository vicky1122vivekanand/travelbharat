import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    places: [{ type: mongoose.Schema.Types.ObjectId, ref: "TouristPlace" }],
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);

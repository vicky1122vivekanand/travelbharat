import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    description: { type: String },
    coverImage: { type: String },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

citySchema.index({ state: 1, slug: 1 }, { unique: true });

export default mongoose.model("City", citySchema);

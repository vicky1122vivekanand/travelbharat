import mongoose from "mongoose";

const festivalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    month: {
      type: String,
      required: true,
      enum: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ],
    },
    description: { type: String, required: true },
    image: { type: String },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

festivalSchema.index({ state: 1, month: 1 });

export default mongoose.model("Festival", festivalSchema);

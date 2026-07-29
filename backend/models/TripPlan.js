import mongoose from "mongoose";

const tripPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    days: [
      {
        label: { type: String, required: true },
        places: [{ type: mongoose.Schema.Types.ObjectId, ref: "TouristPlace" }],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("TripPlan", tripPlanSchema);

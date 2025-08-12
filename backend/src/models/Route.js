import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  routeId: { type: String, required: true },
  distanceKm: { type: Number, required: true },
  trafficLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  baseTimeMinutes: { type: Number, required: true },
});

export default mongoose.model("Route", routeSchema);

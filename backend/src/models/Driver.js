import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // Status for availability/dispatch
    status: {
      type: String,
      enum: ["Active", "Off Duty", "On Break"],
      default: "Active",
    },
    // hours worked in current shift (number, hours)
    currentShiftHours: { type: Number, default: 0 },

    // Array of numbers for the past 7 days hours: [day-1, day-2, ..., day-7]
    // Keep as array to allow showing day-by-day or aggregating
    pastWeekHours: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },

    // deliveries completed today (we can update this from orders later)
    totalDeliveriesToday: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);

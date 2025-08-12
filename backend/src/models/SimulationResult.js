import mongoose from "mongoose";

const simulationResultSchema = new mongoose.Schema(
  {
    totalProfit: { type: Number, required: true },
    efficiencyScore: { type: Number, required: true },
    onTimeDeliveries: { type: Number, required: true },
    lateDeliveries: { type: Number, required: true },
    fuelCost: { type: Number, required: true },

    metadata: {
      numDrivers: Number,
      startTime: String,
      maxHoursPerDay: Number,
      totalOrders: Number,
      totalRoutes: Number,
      availableDrivers: Number,
    },

    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

simulationResultSchema.index({ createdAt: -1 });

export default mongoose.model("SimulationResult", simulationResultSchema);

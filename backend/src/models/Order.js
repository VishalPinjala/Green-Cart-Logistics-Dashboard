import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  valueRs: { type: Number, required: true },
  pickupLocation: { type: String, required: true },
  deliveryLocation: { type: String, required: true },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  status: {
    type: String,
    enum: ["Pending", "In Transit", "Delivered", "Cancelled"],
    default: "Pending",
  },
  priorityLevel: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  estimatedDeliveryTimeMinutes: { type: Number },
  actualDeliveryTimeMinutes: { type: Number },
  orderDate: { type: Date, default: Date.now },
  deliveryTimestamp: { type: Date },
});

export default mongoose.model("Order", orderSchema);

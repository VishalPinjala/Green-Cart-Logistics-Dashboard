import Order from "../models/Order.js";

// Get All Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("assignedRoute")
      .populate("assignedDriver", "name");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Order
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Order
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

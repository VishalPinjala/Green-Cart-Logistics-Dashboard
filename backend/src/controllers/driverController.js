// src/controllers/driverController.js
import Driver from "../models/Driver.js";

/** helper to coerce pastWeekHours input into an array of numbers */
const parsePastWeekHours = (val) => {
  if (!val) return [0, 0, 0, 0, 0, 0, 0];
  if (Array.isArray(val))
    return val
      .map((n) => Number(n) || 0)
      .slice(0, 7)
      .concat(Array(7).fill(0))
      .slice(0, 7);
  if (typeof val === "string") {
    // accept "8,7,6,5,8,7,6" or "8 7 6 5 8 7 6"
    const parts = val.split(/[,|\s]+/).filter(Boolean);
    const nums = parts.map((p) => Number(p) || 0);
    // ensure length 7
    while (nums.length < 7) nums.push(0);
    return nums.slice(0, 7);
  }
  // fallback
  return [0, 0, 0, 0, 0, 0, 0];
};

export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ name: 1 });
    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};

export const createDriver = async (req, res) => {
  try {
    const {
      name,
      status,
      currentShiftHours,
      pastWeekHours,
      totalDeliveriesToday,
    } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const driver = await Driver.create({
      name,
      status: status || "Active",
      currentShiftHours: Number(currentShiftHours) || 0,
      pastWeekHours: parsePastWeekHours(pastWeekHours),
      totalDeliveriesToday: Number(totalDeliveriesToday) || 0,
    });

    res.status(201).json(driver);
  } catch (err) {
    console.error("createDriver error:", err);
    res.status(500).json({ message: "Failed to create driver" });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.pastWeekHours !== undefined) {
      payload.pastWeekHours = parsePastWeekHours(payload.pastWeekHours);
    }
    if (payload.currentShiftHours !== undefined)
      payload.currentShiftHours = Number(payload.currentShiftHours) || 0;
    if (payload.totalDeliveriesToday !== undefined)
      payload.totalDeliveriesToday = Number(payload.totalDeliveriesToday) || 0;

    const updated = await Driver.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: "Driver not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateDriver error:", err);
    res.status(500).json({ message: "Failed to update driver" });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (err) {
    console.error("deleteDriver error:", err);
    res.status(500).json({ message: "Failed to delete driver" });
  }
};

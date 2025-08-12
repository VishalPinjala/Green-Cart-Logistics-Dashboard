import Driver from "../models/Driver.js";
import Route from "../models/Route.js";
import Order from "../models/Order.js";
import SimulationResult from "../models/SimulationResult.js";
import { calculateKPIs } from "../utils/kpiCalculator.js";

export const runSimulation = async (req, res) => {
  try {
    const { numDrivers, startTime, maxHoursPerDay } = req.body;

    // Input validation with detailed error messages
    const errors = [];

    if (!numDrivers || typeof numDrivers !== "number" || numDrivers <= 0) {
      errors.push("Number of drivers must be a positive number");
    }

    if (!startTime || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime)) {
      errors.push("Start time must be in HH:MM format (e.g., 09:30)");
    }

    if (
      !maxHoursPerDay ||
      typeof maxHoursPerDay !== "number" ||
      maxHoursPerDay <= 0 ||
      maxHoursPerDay > 24
    ) {
      errors.push("Max hours per day must be between 1 and 24");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Invalid simulation parameters",
        errors,
      });
    }

    // Fetch data from database
    const [drivers, routes, orders] = await Promise.all([
      Driver.find({ status: "Active" }).sort({ name: 1 }),
      Route.find(),
      Order.find({ status: { $in: ["Pending", "In Transit"] } }).populate(
        "assignedRoute"
      ),
    ]);

    // Check if we have enough active drivers
    if (drivers.length < numDrivers) {
      return res.status(400).json({
        message: `Not enough active drivers available. Requested: ${numDrivers}, Available: ${drivers.length}`,
      });
    }

    // Check if we have orders to process
    if (orders.length === 0) {
      return res.status(400).json({
        message: "No pending or in-transit orders found to simulate",
      });
    }

    // Check if we have routes
    if (routes.length === 0) {
      return res.status(400).json({
        message: "No routes found in the database",
      });
    }

    console.log(
      `Running simulation with ${numDrivers} drivers, start time: ${startTime}, max hours: ${maxHoursPerDay}`
    );
    console.log(
      `Processing ${orders.length} orders across ${routes.length} routes`
    );

    // Calculate KPIs using the updated logic
    const simulationParams = { numDrivers, startTime, maxHoursPerDay };
    const kpiResults = calculateKPIs(orders, drivers, routes, simulationParams);

    // Add simulation metadata
    const simulationData = {
      ...kpiResults,
      simulationParams: {
        numDrivers,
        startTime,
        maxHoursPerDay,
        totalOrders: orders.length,
        totalRoutes: routes.length,
        availableDrivers: drivers.length,
      },
      timestamp: new Date(),
    };

    // Save to database
    const savedResult = await SimulationResult.create({
      totalProfit: simulationData.totalProfit,
      efficiencyScore: simulationData.efficiencyScore,
      onTimeDeliveries: simulationData.onTimeDeliveries,
      lateDeliveries: simulationData.lateDeliveries,
      fuelCost: simulationData.fuelCost,
      metadata: simulationData.simulationParams, // Store simulation parameters
    });

    console.log("Simulation completed successfully:", {
      totalProfit: simulationData.totalProfit,
      efficiencyScore: simulationData.efficiencyScore,
      onTimeDeliveries: simulationData.onTimeDeliveries,
      lateDeliveries: simulationData.lateDeliveries,
    });

    res.json({
      message: "Simulation completed successfully",
      data: {
        id: savedResult._id,
        ...simulationData,
        // Remove details from response (keep for debugging locally)
        details: undefined,
      },
    });
  } catch (err) {
    console.error("Simulation error:", err);
    res.status(500).json({
      message: "Simulation failed",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
};

export const getSimulationHistory = async (req, res) => {
  try {
    const history = await SimulationResult.find()
      .sort({ createdAt: -1 })
      .limit(50) // Limit to last 50 results
      .lean(); // Use lean() for better performance

    // Ensure we always return a valid array
    if (!Array.isArray(history)) {
      return res.json([]);
    }

    // Clean and format the data for frontend consumption
    const cleanedHistory = history.map((item) => ({
      _id: item._id,
      totalProfit: Number(item.totalProfit) || 0,
      efficiencyScore: Number(item.efficiencyScore) || 0,
      onTimeDeliveries: Number(item.onTimeDeliveries) || 0,
      lateDeliveries: Number(item.lateDeliveries) || 0,
      fuelCost: Number(item.fuelCost) || 0,
      createdAt: item.createdAt,
      metadata: item.metadata || {},
    }));

    res.json(cleanedHistory);
  } catch (err) {
    console.error("Error fetching simulation history:", err);
    res.status(500).json({
      message: "Failed to fetch simulation history",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
};

// New endpoint to get current system status
export const getSystemStatus = async (req, res) => {
  try {
    const [driverCount, routeCount, orderCount] = await Promise.all([
      Driver.countDocuments({ status: "Active" }),
      Route.countDocuments(),
      Order.countDocuments({ status: { $in: ["Pending", "In Transit"] } }),
    ]);

    res.json({
      activeDrivers: driverCount,
      totalRoutes: routeCount,
      pendingOrders: orderCount,
      systemReady: driverCount > 0 && routeCount > 0 && orderCount > 0,
    });
  } catch (err) {
    console.error("Error fetching system status:", err);
    res.status(500).json({ message: "Failed to fetch system status" });
  }
};

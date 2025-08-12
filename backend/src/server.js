import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/drivers", driverRoutes);
app.use("/routes", routeRoutes);
app.use("/orders", orderRoutes);
app.use("/simulation", simulationRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

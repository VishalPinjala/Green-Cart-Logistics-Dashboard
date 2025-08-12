import express from "express";
import {
  runSimulation,
  getSimulationHistory,
  getSystemStatus,
} from "../controllers/simulationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, runSimulation);
router.get("/history", protect, getSimulationHistory);
router.get("/status", protect, getSystemStatus);

export default router;

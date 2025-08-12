import express from "express";
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDrivers);
router.post("/", protect, createDriver);
router.put("/:id", protect, updateDriver);
router.delete("/:id", protect, deleteDriver);

export default router;

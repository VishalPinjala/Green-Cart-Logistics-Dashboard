import express from "express";
import {
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../controllers/routeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getRoutes);
router.post("/", protect, createRoute);
router.put("/:id", protect, updateRoute);
router.delete("/:id", protect, deleteRoute);

export default router;

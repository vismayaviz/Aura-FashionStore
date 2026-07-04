import express from "express";

import protect from "../middleware/authMiddleware.js";

import adminOnly from "../middleware/adminMiddleware.js";

import {
  dashboardStats
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  adminOnly,
  dashboardStats
);

export default router;
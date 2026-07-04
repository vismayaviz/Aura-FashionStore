import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js"; // Optional: if you want to protect this route

const router = express.Router();

// Route: GET /api/users
// If you want to require authentication, add your middleware: router.get("/", protect, getAllUsers);
router.get("/", getAllUsers);

export default router;
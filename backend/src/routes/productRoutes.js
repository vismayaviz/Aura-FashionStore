import express from "express";
import multer from "multer";
import path from "path";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// 🟢 Simple storage config saving uploads directly inside a local folder named "uploads/"


router.get("/", getProducts);
router.get("/:id", getProduct);

// 🟢 Hook up upload.array("images") middleware matching the frontend payload key
router.post("/", protect, adminOnly, upload.array("images"), createProduct);
router.put("/:id", protect, adminOnly, upload.array("images"), updateProduct);

router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
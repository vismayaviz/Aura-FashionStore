import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  addToWishlist,
  getWishlist,
  removeWishlistItem
} from "../controllers/wishlistController.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);

router.post("/add", addToWishlist);

router.delete(
  "/remove/:productId",
  removeWishlistItem
);

export default router;
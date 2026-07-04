import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} from "../controllers/cartController.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);

router.post("/add", addToCart);

router.put("/update", updateCartItem);

router.delete(
  "/remove/:productId",
  removeCartItem
);

export default router;
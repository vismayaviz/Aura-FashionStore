import express from "express";

import {
  register,
  verifyOTP,
  resendOTP,
  login,
  me
} from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profilePhoto"), register);

router.post("/verify-otp", verifyOTP);

router.post(
  "/resend-otp",
  resendOTP
);

router.post("/login", login);

router.get("/me", protect, me);

export default router;
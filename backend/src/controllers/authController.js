import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateOTP from "../utils/generateOTP.js";
import generateToken from "../utils/generateToken.js";
import sendOTPEmail from "../services/sendOTPEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, profilePhoto } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let profilePhotoPath = "";
    if (req.file) {
      profilePhotoPath = `/uploads/${req.file.filename}`; // Save relative accessible URL path
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    // It is correct to create the user here with defaults (isVerified: false)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePhoto: profilePhotoPath,
      otp,
      otpExpires
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "Registered successfully. Verify OTP.",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Check expiration first
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 2. CRITICAL FIX: Verify if the submitted OTP matches the database record
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code. Please try again." });
    }

    // 3. Update verification status if everything matches
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Verify email before login" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import  User from "../models/User.js";

// @desc    Get all users for admin panel
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding their passwords for security
    const users = await User.find({role: "user"}, "-password"); // Exclude the password field

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch users",
      error: error.message,
    });
  }
};

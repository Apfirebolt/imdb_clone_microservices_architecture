import asyncHandler from "express-async-handler";
import User from "../models/user.js";

// @desc    List of users
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const itemsPerPage = 50;
  const startPage = req.query.page || 1;
  const users = await User.find()
    .skip(itemsPerPage * startPage - itemsPerPage)
    .limit(itemsPerPage)
    .exec();
  const count = await User.countDocuments();
  res.status(200).json({
    data: users,
    total: count,
    success: true,
    itemsPerPage,
    startPage,
    lastPage: Math.ceil(count / itemsPerPage),
  });
});

// @desc    Get existing User
// @route   GET /api/users/id
// @access  Private - User or Admin
const getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});


export {
  getUsers,
  getSingleUser
};
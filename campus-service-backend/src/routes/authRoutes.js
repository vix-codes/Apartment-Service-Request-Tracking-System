const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  register,
  login,
  createUserByAdmin,
  getTechnicians,
  getAllUsers,
} = require("../controllers/authController");

// PUBLIC: tenant self-registration
router.post("/register", register);

// PUBLIC: login
router.post("/login", login);

// ADMIN: create user (tenant/technician/manager)
router.post("/create-user", authMiddleware, createUserByAdmin);

// AUTH: list technicians (for assignment dropdown)
router.get("/technicians", authMiddleware, getTechnicians);

// ADMIN: list all users
router.get("/all", authMiddleware, getAllUsers);

module.exports = router;

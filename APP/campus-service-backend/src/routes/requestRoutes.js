const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");

const {
  createRequest,
  getRequests,
  assignRequest,
  updateStatus,
  updatePriority,
  deleteRequest,
} = require("../controllers/requestController");

// 🟢 ALL LOGGED IN USERS CAN VIEW (role-filtered)
router.get("/", auth, getRequests);

// 🟢 TENANT CREATE
router.post("/", auth, createRequest);

// 🟢 MANAGER/ADMIN ASSIGN
router.put("/assign/:id", auth, assignRequest);

// 🟢 STATUS UPDATE
router.put("/status/:id", auth, updateStatus);

// 🟢 MANAGER/ADMIN PRIORITY UPDATE
router.put("/priority/:id", auth, updatePriority);

// 🟢 ADMIN DELETE
router.delete("/:id", auth, deleteRequest);

module.exports = router;

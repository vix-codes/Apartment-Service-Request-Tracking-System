const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");

const {
  createRequest,
  getRequests,
  assignRequest,
  updateStatus,
  deleteRequest,
} = require("../controllers/requestController");

// 🟢 ALL LOGGED IN USERS CAN VIEW
router.get("/", auth, getRequests);

// 🟢 STUDENT CREATE
router.post("/", auth, createRequest);

// 🟢 ADMIN ASSIGN
router.put("/assign/:id", auth, assignRequest);

// 🟢 STAFF STATUS UPDATE
router.put("/status/:id", auth, updateStatus);

// 🟢 ADMIN DELETE
router.delete("/:id", auth, deleteRequest);

module.exports = router;

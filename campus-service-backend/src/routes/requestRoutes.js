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

router.post("/", auth, createRequest);
router.get("/", auth, getRequests);

router.put("/assign/:id", auth, assignRequest);
router.put("/status/:id", auth, updateStatus);

router.delete("/:id", auth, deleteRequest);

module.exports = router;

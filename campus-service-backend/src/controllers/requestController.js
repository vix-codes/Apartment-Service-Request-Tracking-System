const Request = require("../models/Request");
const User = require("../models/User");


// 🟢 CREATE REQUEST (student)
exports.createRequest = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const request = await Request.create({
      title,
      description,
      image: image || "",
      createdBy: req.user.id,
      status: "Open",
    });

    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 GET ALL REQUESTS (admin sees all, staff sees assigned)
exports.getRequests = async (req, res) => {
  try {
    let requests;

    if (req.user.role === "staff") {
      requests = await Request.find({ assignedTo: req.user.id })
        .populate("createdBy", "name email")
        .populate("assignedTo", "name");
    } else {
      requests = await Request.find()
        .populate("createdBy", "name email")
        .populate("assignedTo", "name")
        .populate("closedBy", "name");
    }

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 ASSIGN REQUEST (ADMIN)
exports.assignRequest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { id } = req.params;
    const { staffId } = req.body;

    const staff = await User.findById(staffId);
    if (!staff || staff.role !== "staff") {
      return res.status(400).json({ message: "Invalid staff" });
    }

    const request = await Request.findByIdAndUpdate(
      id,
      {
        assignedTo: staffId,
        status: "Assigned",
        assignedAt: new Date(),
      },
      { new: true }
    )
      .populate("assignedTo", "name")
      .populate("createdBy", "name");

    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 STAFF UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const request = await Request.findById(id);

    if (!request) return res.status(404).json({ message: "Not found" });

    // only assigned staff can update
    if (req.user.role === "staff" && request.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }

    if (status === "Closed") {
      request.status = "Closed";
      request.closedBy = req.user.id;
      request.closedAt = new Date();
    }

    if (status === "Rejected") {
      request.status = "Open";
      request.assignedTo = null;
      request.rejectReason = reason || "";
    }

    if (status === "In Progress") {
      request.status = "In Progress";
    }

    await request.save();

    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 DELETE
exports.deleteRequest = async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Notification = require("../models/Notification");
const User = require("../models/User");

const createNotification = async ({
  userId,
  title = "Notification",
  message,
  type = "SYSTEM",
  requestId = null,
}) => {
  try {
    await Notification.create({ userId, title, message, type, requestId });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};

// send notification to all admins
const notifyAdmins = async ({
  title = "Notification",
  message,
  type = "SYSTEM",
  requestId = null,
}) => {
  try {
    const admins = await User.find({ role: "admin" }).select("_id");
    if (!admins || admins.length === 0) return;
    const docs = admins.map((a) => ({
      userId: a._id,
      title,
      message,
      type,
      requestId,
    }));
    await Notification.insertMany(docs);
  } catch (err) {
    console.error("Failed to notify admins:", err.message);
  }
};

module.exports = { createNotification, notifyAdmins };

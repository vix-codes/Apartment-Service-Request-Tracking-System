const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uriCandidates = [
      process.env.MONGO_URI,
      process.env.MONGODB_URI,
      process.env.MONGO_URL,
      process.env.DATABASE_URL,
    ];

    const uri = uriCandidates.find((v) => typeof v === "string" && v.trim().length > 0);

    if (!uri) {
      // Diagnostics (does not print secret values, only presence).
      const presence = {
        MONGO_URI: !!process.env.MONGO_URI,
        MONGODB_URI: !!process.env.MONGODB_URI,
        MONGO_URL: !!process.env.MONGO_URL,
        DATABASE_URL: !!process.env.DATABASE_URL,
      };
      const mongoLikeKeys = Object.keys(process.env).filter((k) => /mongo/i.test(k)).sort();
      console.error(
        "MongoDB connection failed: missing connection string. Set one of: MONGO_URI, MONGODB_URI, MONGO_URL, DATABASE_URL"
      );
      console.error("Mongo env presence:", presence);
      if (mongoLikeKeys.length) console.error("Mongo-like env keys:", mongoLikeKeys.join(", "));
      process.exit(1);
    }

    await mongoose.connect(uri.trim());

    console.log("🟢 MongoDB connected successfully");

  } catch (error) {
    console.error("🔴 MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

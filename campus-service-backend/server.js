
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const seedAdmin = require("./scripts/seedAdmin");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET && process.env.NODE_ENV !== "development") {
      console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
      process.exit(1);
    }

    // Connect to the database
    await connectDB();

    // Seed the admin user if enabled
    await seedAdmin();

    // Start the server
    app.listen(PORT, () => {
      console.log("=================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("=================================");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

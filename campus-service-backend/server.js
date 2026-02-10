require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");


// 🟢 CONNECT DATABASE
connectDB();

const PORT = process.env.PORT || 5000;

// Optional: seed/bootstrap an admin user in a brand-new database.
// Set `SEED_ADMIN=true` and provide `ADMIN_EMAIL` + `ADMIN_PASSWORD` (and optional `ADMIN_NAME`).
const bootstrapAdminIfEnabled = async () => {
  if (String(process.env.SEED_ADMIN || "").toLowerCase() !== "true") return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.error(
      "SEED_ADMIN=true but missing ADMIN_EMAIL/ADMIN_PASSWORD. Skipping admin bootstrap."
    );
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.password = hash;
    existing.role = "admin";
    existing.isActive = true;
    if (!existing.name) existing.name = name;
    await existing.save();
    console.log(`Bootstrapped admin (updated): ${email}`);
    return;
  }

  await User.create({
    name,
    email,
    password: hash,
    role: "admin",
    isActive: true,
  });

  console.log(`Bootstrapped admin (created): ${email}`);
};


// 🟢 START SERVER
app.listen(PORT, async () => {
  try {
    await bootstrapAdminIfEnabled();
  } catch (e) {
    console.error("Admin bootstrap failed:", e?.message || e);
  }
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("=================================");
});

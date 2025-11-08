const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const deptRoutes = require("./routes/departments");
const patientRoutes = require("./routes/patients");
const statsRoutes = require("./routes/stats");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/departments", deptRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 5050;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Ensure default admin user (admin / admin123) exists for convenience
    (async () => {
      try {
        const User = require("./models/User");
        const bcrypt = require("bcrypt");
        const existing = await User.findOne({
          $or: [{ email: "admin" }, { email: "admin@example.com" }],
        });
        if (!existing) {
          const hashed = await bcrypt.hash("admin123", 10);
          await User.create({
            name: "Admin",
            email: "admin",
            password: hashed,
          });
          console.log("Created default admin user (admin / admin123)");
        }
      } catch (e) {
        console.error("Could not create default admin", e.message);
      }
    })();

    app.listen(PORT, () => console.log("Server running on", PORT));
  })
  .catch((err) => {
    console.error("DB connection error", err.message);
  });

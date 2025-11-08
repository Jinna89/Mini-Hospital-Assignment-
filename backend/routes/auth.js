const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // allow default dev credential admin/admin123
  if (
    (email === "admin" || email === "admin@example.com") &&
    password === "admin123"
  ) {
    const token = jwt.sign(
      { id: "local-admin", email: email },
      process.env.JWT_SECRET || "dev-secret"
    );
    return res.json({
      token,
      user: { id: "local-admin", name: "Admin", email },
    });
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET
  );
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const u = await User.create({ name, email, password: hashed });
    res.json({ id: u._id, email: u.email });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;

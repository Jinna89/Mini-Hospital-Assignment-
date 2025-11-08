const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const list = await Department.find();
  res.json(list);
});

// Public minimal list for sidebar (no auth required)
router.get("/public", async (req, res) => {
  const list = await Department.find().select("name");
  res.json(list);
});

router.post("/", auth, async (req, res) => {
  const d = await Department.create(req.body);
  res.json(d);
});

router.put("/:id", auth, async (req, res) => {
  const d = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!d) return res.status(404).json({ message: "Not found" });
  res.json(d);
});

router.delete("/:id", auth, async (req, res) => {
  const d = await Department.findByIdAndDelete(req.params.id);
  if (!d) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

module.exports = router;

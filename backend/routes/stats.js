const express = require("express");
const router = express.Router();

const Department = require("../models/Department");
let Patient;
try {
  Patient = require("../models/Patient");
} catch (e) {
  Patient = null;
}

router.get("/", async (req, res) => {
  try {
    const departments = await Department.countDocuments();
    const patients = Patient ? await Patient.countDocuments() : 0;
    res.json({ departments, patients });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;

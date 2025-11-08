const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: String,
    description: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Department", schema);

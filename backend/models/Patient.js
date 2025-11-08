const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobile: String,
  dob: Date,
  gender: String,
  notes: String
}, { timestamps: true })
module.exports = mongoose.model('Patient', schema)

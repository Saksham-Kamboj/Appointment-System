const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: Date,
  time: String,
  status: String,
});

module.exports = mongoose.model("Appointment", appointmentSchema);

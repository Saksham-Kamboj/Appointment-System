const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  student_id: mongoose.Schema.Types.ObjectId,
  teacher_id: mongoose.Schema.Types.ObjectId,
  date: Date,
  time: String,
  status: String,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
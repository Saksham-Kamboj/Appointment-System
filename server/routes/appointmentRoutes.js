const express = require("express");
const Appointment = require("../models/Appointment");
const { authenticateToken } = require("../middleware/middleware");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "Student") {
    return res
      .status(403)
      .json({ error: "Only students can create appointments" });
  }

  try {
    const { teacher_id, date, time } = req.body;
    const appointment = new Appointment({
      student_id: req.user.id,
      teacher_id,
      date,
      time,
      status: "Pending",
    });
    await appointment.save();
    res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating appointment" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    let appointments;
    if (req.user.role === "Student") {
      appointments = await Appointment.find({ student_id: req.user.id });
    } else if (req.user.role === "Teacher") {
      appointments = await Appointment.find({ teacher_id: req.user.id });
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching appointments" });
  }
});

router.put("/:id/confirm", authenticateToken, async (req, res) => {
  if (req.user.role !== "Teacher") {
    return res
      .status(403)
      .json({ error: "Only teachers can confirm appointments" });
  }

  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, teacher_id: req.user.id },
      { status: "Confirmed" },
      { new: true }
    );
    if (!appointment) {
      res
        .status(404)
        .json({ error: "Appointment not found or not authorized" });
    } else {
      res.json({ message: "Appointment confirmed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error confirming appointment" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "Student") {
    return res
      .status(403)
      .json({ error: "Only students can delete appointments" });
  }

  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findOneAndDelete({
      _id: appointmentId,
      student_id: req.user.id,
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ error: "Appointment not found or not authorized" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting appointment" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  addSchedule,
  updateSchedule,
  getSchedules,
  getScheduleById,
  deleteSchedule,
  getSchedulePDF,
} = require("../controllers/addDataController");

// Route to add a new schedule
router
  .post("/add-schedule", addSchedule)

  // Route to update an existing schedule
  .put("/schedule/:id", updateSchedule)

  // Route to get all schedules
  .get("/get-schedules", getSchedules)

  // Route to get a specific schedule by ID
  .get("/get-schedule/:id", getScheduleById)

  .get("/get-schedule-pdf/:id", getSchedulePDF)
  // Route to delete a specific schedule by ID
  .delete("/remove-schedule/:id", deleteSchedule);

module.exports = router;

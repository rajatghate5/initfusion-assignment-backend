const SchoolSchedule = require("../models/SchoolSchedule");
const generatePDF = require("../utils/generatePDF");

// Create a new school schedule
const addSchedule = async (req, res) => {
  const {
    schoolName,
    principalName,
    vicePrincipalName,
    standard,
    division,
    subjects,
  } = req.body;

  if (
    !schoolName ||
    !principalName ||
    !vicePrincipalName ||
    !standard ||
    !division ||
    !subjects
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newSchedule = new SchoolSchedule({
      schoolName,
      principalName,
      vicePrincipalName,
      standard,
      division,
      subjects,
    });

    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    console.error("Error in addSchedule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an existing school schedule
const updateSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSchedule = await SchoolSchedule.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },

      { new: true } // Return the updated document
    );

    if (!updatedSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error in updateSchedule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all school schedules
const getSchedules = async (req, res) => {
  try {
    // Fetch the schedules with pagination
    const schedules = await SchoolSchedule.find().select(
      "schoolName principalName vicePrincipalName standard division"
    ); // Select specific fields

    // Get the total count of schedules for pagination metadata

    // Return the schedules along with pagination info
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error in getSchedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Schedule PDF
const getSchedulePDF = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the specific schedule document from the database
    const schedule = await SchoolSchedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    // Generate the PDF and send it as a response
    generatePDF(schedule, res);
  } catch (error) {
    console.error("Error in downloadSchedulePDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific school schedule by ID
const getScheduleById = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await SchoolSchedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error in getScheduleById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a specific school schedule by ID
const deleteSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSchedule = await SchoolSchedule.findByIdAndDelete(id);
    if (!deletedSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSchedule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addSchedule,
  updateSchedule,
  getSchedules,
  getSchedulePDF,
  getScheduleById,
  deleteSchedule,
};

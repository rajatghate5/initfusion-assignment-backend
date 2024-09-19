const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Subject name
      required: true,
    },
    lectures: [String],
  },
  { _id: false }
);

const schoolScheduleSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
    },
    principalName: {
      type: String,
      required: true,
    },
    vicePrincipalName: {
      type: String,
      required: true,
    },
    standard: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      required: true,
    },
    subjects: [subjectSchema],
  },
  { timestamps: true }
);

const SchoolSchedule = mongoose.model("SchoolSchedule", schoolScheduleSchema);

module.exports = SchoolSchedule;

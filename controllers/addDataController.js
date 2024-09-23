const SchoolSchedule = require("../models/SchoolSchedule");

// Create a new school schedule
// const addSchedule = async (req, res) => {
//   const {
//     schoolName,
//     principalName,
//     vicePrincipalName,
//     standard,
//     division,
//     subjects,
//   } = req.body;

//   if (
//     !schoolName ||
//     !principalName ||
//     !vicePrincipalName ||
//     !standard ||
//     !division ||
//     !subjects
//   ) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const newSchedule = new SchoolSchedule({
//       schoolName,
//       principalName,
//       vicePrincipalName,
//       standard,
//       division,
//       subjects,
//     });

//     const savedSchedule = await newSchedule.save();
//     res.status(201).json(savedSchedule);
//   } catch (error) {
//     console.error("Error in addSchedule:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

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
// const getSchedulePDF = async (req, res) => {
//   const { id } = req.params;
//   try {
//     // Fetch the specific schedule document from the database
//     const schedule = await SchoolSchedule.findById(id);
//     if (!schedule) {
//       return res.status(404).json({ error: "Schedule not found" });
//     }
//     // Generate the PDF and send it as a response
//     generatePDF(schedule, res);
//   } catch (error) {
//     console.error("Error in downloadSchedulePDF:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

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

// ? Working code
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Schedule");

    // Merge cells A1 to G1 and A2 to G2
    worksheet.mergeCells("A1:G1");
    worksheet.mergeCells("A2:G2");

    // Set SCHOOL_NAME in merged cell A1
    const schoolNameCell = worksheet.getCell("A1");
    schoolNameCell.value = "SCHOOL_NAME";
    schoolNameCell.font = { bold: true, size: 18 };
    schoolNameCell.alignment = { vertical: "middle", horizontal: "center" };
    schoolNameCell.border = {
      top: { style: "thick", color: { argb: "FF000000" } },
      left: { style: "thick", color: { argb: "FF000000" } },
      bottom: { style: "thick", color: { argb: "FF000000" } },
      right: { style: "thick", color: { argb: "FF000000" } },
    };

    // Set schoolName in merged cell A2
    const schoolNameCell2 = worksheet.getCell("A2");
    schoolNameCell2.value = schoolName.toUpperCase();
    schoolNameCell2.font = { bold: true, size: 18 };
    schoolNameCell2.alignment = { vertical: "middle", horizontal: "center" };
    schoolNameCell2.border = {
      top: { style: "thick", color: { argb: "FF000000" } },
      left: { style: "thick", color: { argb: "FF000000" } },
      bottom: { style: "thick", color: { argb: "FF000000" } },
      right: { style: "thick", color: { argb: "FF000000" } },
    };

    // Add other schedule data
    worksheet.addRow([]); // Empty row
    const principalRow = worksheet.addRow([
      "Principal Name",
      principalName,
      "",
      "Vice Principal Name",
      vicePrincipalName,
    ]);

    // Set font for cells in the principalRow
    principalRow.getCell(2).font = { bold: true, size: 13 }; // Principal Name cell
    principalRow.getCell(5).font = { bold: true, size: 13 }; // Vice Principal Name cell

    const standardRow = worksheet.addRow(["Standard", standard]);
    standardRow.getCell(2).font = { bold: true, size: 13 }; // Set font for standard cell

    const divisionRow = worksheet.addRow(["Division", division]);
    divisionRow.getCell(2).font = { bold: true, size: 13 }; // Set font for division cell

    const headerRow = worksheet.addRow([
      "Subject",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]); // Headers

    // Set row heights
    principalRow.height = 30; // Increase row height
    standardRow.height = 30; // Increase row height
    divisionRow.height = 30; // Increase row height
    headerRow.height = 30; // Increase header row height

    // Center alignment for headerRow
    headerRow.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.font = { size: 10 }; // Increase font size for headers
    });

    // Function to set outer borders for a row
    const setOuterBorders = (row) => {
      for (let col = 1; col <= 7; col++) {
        const cell = worksheet.getCell(row.number, col);
        cell.border = {
          left: { style: "thick", color: { argb: "FF000000" } },
          right: { style: "thick", color: { argb: "FF000000" } },
          top:
            row.number === principalRow.number
              ? { style: "thick", color: { argb: "FF000000" } }
              : undefined,
          bottom: { style: "thick", color: { argb: "FF000000" } }, // Always apply bottom border
        };

        // Center alignment for subject lectures
        if (row.number > headerRow.number) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = { size: 9 }; // Increase font size for subject lectures
        }
      }

      // Add extra bottom border if it's one of the last two rows
      if (
        row.number === worksheet.lastRow.number ||
        row.number === worksheet.lastRow.number - 1
      ) {
        for (let col = 1; col <= 7; col++) {
          const cell = worksheet.getCell(row.number, col);
          cell.border.bottom = { style: "thick", color: { argb: "FF000000" } }; // Extra border
        }
      }
    };

    // Apply borders to the relevant rows
    [principalRow, standardRow, divisionRow, headerRow].forEach(
      setOuterBorders
    );

    // Add subject rows and set outer borders for them

    subjects.forEach((subject) => {
      const subjectRow = worksheet.addRow([
        subject.name,
        ...subject.lectures.map((lecture) => lecture || ""),
      ]);
      setOuterBorders(subjectRow); // Set border for each subject row
    });

    // Set column widths for A to G
    worksheet.columns = [
      { width: 20 }, // A
      { width: 20 }, // B
      { width: 20 }, // C
      { width: 20 }, // D
      { width: 20 }, // E
      { width: 20 }, // F
      { width: 20 }, // G
    ];

    const fileName = `school_schedule_${savedSchedule._id}.xlsx`;
    const filePath = path.join(__dirname, "../public", fileName);

    if (!fs.existsSync(path.join(__dirname, "../public"))) {
      fs.mkdirSync(path.join(__dirname, "../public"), { recursive: true });
    }

    await workbook.xlsx.writeFile(filePath);

    res.status(201).json(savedSchedule);
  } catch (error) {
    console.error("Error in addSchedule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");
const fsPromises = require('fs').promises;
const getSchedulePDF = async (req, res) => {
  const { id } = req.params;
  try {
    const publicDir = path.join(__dirname, "../public");
    const files = await fsPromises.readdir(publicDir);
    const fileName = files.find(
      (file) => file.includes(id) && file.endsWith(".xlsx")
    );
    if (!fileName) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(publicDir, fileName);

    // Step 1: Read the .xlsx file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName];

    // Step 2: Convert the .xlsx sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Step 3: Clean up and process the JSON data (if needed)
    // Let's assume the first two rows are duplicate headers, we'll remove them
    let cleanedData = [];
    let headers = new Set(); // Use set to store unique headers

    jsonData.forEach((row, index) => {
      if (index === 0 || index === 1) {
        // Add headers to the set to remove duplicates
        row.forEach((cell) => headers.add(cell));
      } else {
        // Add rest of the data (after the first two rows)
        cleanedData.push(row);
      }
    });

    // Step 4: Convert the Set to an Array for headers
    const uniqueHeaders = Array.from(headers).filter(Boolean);

    // Step 5: Create a PDF document
    const pdfDoc = new PDFDocument();
    const pdfFilePath = path.join(
      publicDir,
      `${fileName.replace(".xlsx", ".pdf")}`
    );
    const writeStream = fs.createWriteStream(pdfFilePath);

    pdfDoc.pipe(writeStream);

    // Step 6: Write the headers to the PDF
    pdfDoc
      .fontSize(16)
      .text("School Schedule", { align: "center" })
      .moveDown(2);
    pdfDoc
      .fontSize(12)
      .text(uniqueHeaders.join(" | "), { align: "left" })
      .moveDown();

    // Step 7: Write the data rows to the PDF
    cleanedData.forEach((row) => {
      const rowString = row.join(" | ");
      pdfDoc.fontSize(12).text(rowString, { align: "left" }).moveDown();
    });

    pdfDoc.end();

    // Step 8: Wait until the PDF file is fully written
    await new Promise((resolve) => writeStream.on("finish", resolve));

    // Step 9: Send the generated PDF as response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName.replace(".xlsx", ".pdf")}"`
    );
    const pdfBytes = await fs.promises.readFile(pdfFilePath);
    res.send(pdfBytes);
  } catch (error) {
    console.error("Error in getSchedulePDF:", error);
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

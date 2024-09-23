const SchoolSchedule = require("../models/SchoolSchedule");

//  Create schedule and store in excel file
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");
const puppeteer = require("puppeteer");

// Create an schedule
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

    principalRow.getCell(2).font = { bold: true, size: 13 };
    principalRow.getCell(5).font = { bold: true, size: 13 }; // Vice Principal Name cell

    const standardRow = worksheet.addRow(["Standard", standard]);
    standardRow.getCell(2).font = { bold: true, size: 13 }; //

    const divisionRow = worksheet.addRow(["Division", division]);
    divisionRow.getCell(2).font = { bold: true, size: 13 };

    const headerRow = worksheet.addRow([
      "Subject",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]);

    // Set row heights
    principalRow.height = 30;
    standardRow.height = 30;
    divisionRow.height = 30;
    headerRow.height = 30;

    // Center alignment for headerRow
    headerRow.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.font = { size: 10 };
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
          bottom: { style: "thick", color: { argb: "FF000000" } },
        };

        if (row.number > headerRow.number) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = { size: 9 };
        }
      }

      if (
        row.number === worksheet.lastRow.number ||
        row.number === worksheet.lastRow.number - 1
      ) {
        for (let col = 1; col <= 7; col++) {
          const cell = worksheet.getCell(row.number, col);
          cell.border.bottom = { style: "thick", color: { argb: "FF000000" } };
        }
      }
    };

    [principalRow, standardRow, divisionRow, headerRow].forEach(
      setOuterBorders
    );

    subjects.forEach((subject) => {
      const subjectRow = worksheet.addRow([
        subject.name,
        ...subject.lectures.map((lecture) => lecture || ""),
      ]);
      setOuterBorders(subjectRow); // Set border for each subject row
    });

    // Set column widths for A to G
    worksheet.columns = [
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
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

// Get PDF of the schedules
const getSchedulePDF = async (req, res) => {
  const { id } = req.params;
  try {
    const publicDir = path.join(__dirname, "../public");
    const files = await fs.promises.readdir(publicDir);
    const fileName = files.find(
      (file) => file.includes(id) && file.endsWith(".xlsx")
    );
    if (!fileName) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(publicDir, fileName);

    // Getting the data of .xlsx file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName];

    // converting data to image
    const htmlContent = XLSX.utils.sheet_to_html(sheet);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const imageFilePath = path.join(
      publicDir,
      `${fileName.replace(".xlsx", ".jpg")}`
    );

    // Taking the screenshot of the page
    await page.screenshot({
      path: imageFilePath,
      type: "jpeg",
      fullPage: true,
    });

    await browser.close();
    const pdfDoc = new PDFDocument();
    const pdfFilePath = path.join(
      publicDir,
      `${fileName.replace(".xlsx", ".pdf")}`
    );
    const writeStream = fs.createWriteStream(pdfFilePath);

    pdfDoc.pipe(writeStream);

    // Adding jpg data to pdf
    pdfDoc.image(imageFilePath, {
      fit: [500, 600], // Fit the image into the PDF dimensions
    });

    pdfDoc.end();

    // Writing the data in the pdf file
    await new Promise((resolve) => writeStream.on("finish", resolve));

    // Deleting the jpeg file
    await fs.promises.unlink(imageFilePath);
    // Sending the pdf file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName.replace(".xlsx", ".pdf")}"`
    );
    const pdfBytes = await fs.promises.readFile(pdfFilePath);
    res.send(pdfBytes);

    await fs.promises.unlink(pdfFilePath);
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

// const PDFDocument = require("pdfkit");

// const generatePDF = (schedule, res) => {
//   const doc = new PDFDocument({
//     size: [841.89, 595.28],
//   });

//   res.setHeader("Content-disposition", "attachment; filename=schedule.pdf");
//   res.setHeader("Content-type", "application/pdf");

//   doc.pipe(res);

//   // Define table column widths for headers and subjects
//   const headerColumnWidths = {
//     subject: 100, // Width for subject header
//     monday: 100,
//     tuesday: 110,
//     wednesday: 105,
//     thursday: 105,
//     friday: 108,
//     saturday: 106,
//   };

//   const subjectColumnWidths = {
//     subject: 72, // Width for subject name
//     monday: 80,
//     tuesday: 80,
//     wednesday: 80,
//     thursday: 80,
//     friday: 80,
//     saturday: 80,
//   };

//   const rowHeight = 30; // Height of each row
//   const startX = 50; // Starting X position
//   let startY = 100; // Starting Y position

//   doc.fontSize(18).text("SCHOOL_NAME", startX, startY, { align: "center" });
//   startY += rowHeight;
//   // Draw school name
//   doc
//     .fontSize(18)
//     .text(schedule.schoolName, startX, startY, { align: "center",  });
//   startY += rowHeight * 2;

//   // Draw principal and vice principal names
//   doc
//     .fontSize(12)
//     .text(`Principal Name: ${schedule.principalName}`, startX, startY, {
//       continued: true,
//     })
//     .text(
//       `Vice Principal Name: ${schedule.vicePrincipalName}`,
//       startX + headerColumnWidths.subject + 10,
//       startY
//     );
//   startY += rowHeight;

//   // Draw standard and division
//   doc
//     .fontSize(12)
//     .text(`Standard: ${schedule.standard}`, startX, startY, { continued: true })
//     .text(
//       `Division: ${schedule.division}`,
//       startX + headerColumnWidths.subject + 70,
//       startY
//     );
//   startY += rowHeight * 2;

//   // Draw table headers
//   const headerTitles = [
//     "Subject",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   headerTitles.forEach((title, index) => {
//     doc
//       .fontSize(12)
//       .text(
//         title,
//         startX +
//           index * headerColumnWidths[Object.keys(headerColumnWidths)[index]],
//         startY
//       );
//   });

//   // Draw table header bottom border
//   doc
//     .lineWidth(1)
//     .moveTo(startX, startY + rowHeight)
//     .lineTo(
//       startX +
//         Object.values(headerColumnWidths).reduce(
//           (acc, width) => acc + width,
//           0
//         ) -
//         20,
//       startY + rowHeight
//     )
//     .stroke();

//   // Draw vertical lines for headers
//   let currentX = startX;
//   doc.lineWidth(1);
//   Object.keys(headerColumnWidths).forEach((key) => {
//     currentX += headerColumnWidths[key];
//     doc
//       .moveTo(currentX - 20, startY)
//       .lineTo(
//         currentX - 20,
//         startY + (schedule.subjects.length + 1) * rowHeight
//       )
//       .stroke();
//   });

//   // Add a row for each subject
//   schedule.subjects.forEach((subject) => {
//     startY += rowHeight;

//     // Draw subject name
//     doc.fontSize(10).text(subject.name, startX, startY + 5);

//     // For each day, display lecture times for that subject
//     const lectureTimes = subject.lectures.join("    ");
//     doc.text(
//       lectureTimes,
//       startX + subjectColumnWidths.subject + 10,
//       startY + 5
//     );

//     // Draw row border
//     doc
//       .lineWidth(1)
//       .moveTo(startX, startY + rowHeight)
//       .lineTo(
//         startX +
//           Object.values(subjectColumnWidths).reduce(
//             (acc, width) => acc + width,
//             0
//           ) +
//           162,
//         startY + rowHeight
//       )
//       .stroke();
//   });

//   // Draw table bottom border
//   doc
//     .lineWidth(1)
//     .moveTo(startX, startY + rowHeight)
//     .lineTo(
//       startX +
//         Object.values(subjectColumnWidths).reduce(
//           (acc, width) => acc + width,
//           0
//         ),
//       startY + rowHeight
//     )
//     .stroke();

//   // End the document
//   doc.end();
// };

// module.exports = generatePDF;

const PDFDocument = require("pdfkit");

const generatePDF = (schedule, res) => {
  const doc = new PDFDocument({
    size: [841.89, 595.28],
  });

  res.setHeader("Content-disposition", "attachment; filename=schedule.pdf");
  res.setHeader("Content-type", "application/pdf");

  doc.pipe(res);

  // Define table column widths for headers and subjects
  const headerColumnWidths = {
    subject: 100, // Width for subject header
    monday: 100,
    tuesday: 105,
    wednesday: 105,
    thursday: 105,
    friday: 108,
    saturday: 106,
  };

  const subjectColumnWidths = {
    subject: 72, // Width for subject name
    monday: 80,
    tuesday: 80,
    wednesday: 80,
    thursday: 80,
    friday: 80,
    saturday: 80,
  };

  const rowHeight = 30; // Height of each row
  const startX = 50; // Starting X position
  let startY = 100; // Starting Y position

  doc.fontSize(18).text("SCHOOL_NAME", startX, startY, { align: "center" });
  startY += rowHeight;
  // Draw school name
  doc
    .fontSize(18)
    .text(schedule.schoolName, startX, startY, { align: "center" });
  startY += rowHeight * 2;

  // Draw principal and vice principal names
  doc
    .fontSize(12)
    .text(`Principal Name: ${schedule.principalName}`, startX, startY, {
      continued: true,
    })
    .text(
      `Vice Principal Name: ${schedule.vicePrincipalName}`,
      startX + headerColumnWidths.subject + 10,
      startY
    );
  startY += rowHeight;

  // Draw standard and division
  doc.fontSize(12).text(`Standard: ${schedule.standard}`, startX, startY, {
    continued: true,
  });

  startY += rowHeight;

  doc.fontSize(12).text(`Division: ${schedule.division}`, startX - 78, startY);
  startY += rowHeight;

  // Draw table headers
  const headerTitles = [
    "Subject",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  headerTitles.forEach((title, index) => {
    doc
      .fontSize(12)
      .text(
        title,
        startX +
          index * headerColumnWidths[Object.keys(headerColumnWidths)[index]],
        startY + 10
      );
  });

  doc
    .lineWidth(1)
    .moveTo(startX - 20, startY)
    .lineTo(
      startX +
        Object.values(headerColumnWidths).reduce(
          (acc, width) => acc + width,
          0
        ) -
        20,
      startY
    )
    .stroke();

  // Draw table header bottom border
  doc
    .lineWidth(1)
    .moveTo(startX - 20, startY + rowHeight)
    .lineTo(
      startX +
        Object.values(headerColumnWidths).reduce(
          (acc, width) => acc + width,
          0
        ) -
        20,
      startY + rowHeight
    )
    .stroke();

  // Draw vertical lines for headers
  let currentX = startX;
  doc.lineWidth(1);
  Object.keys(headerColumnWidths).forEach((key) => {
    currentX += headerColumnWidths[key];
    doc
      .moveTo(currentX - 20, startY)
      .lineTo(
        currentX - 20,
        startY + (schedule.subjects.length + 1) * rowHeight
      )
      .stroke();
  });

  // Draw vertical line at the start of the Subject column
  doc
    .lineWidth(1)
    .moveTo(startX - 20, startY)
    .lineTo(startX - 20, startY + (schedule.subjects.length + 1) * rowHeight)
    .stroke();

  // Add a row for each subject
  schedule.subjects.forEach((subject) => {
    startY += rowHeight;

    // Draw subject name
    doc.fontSize(10).text(subject.name, startX, startY + 5);

    // For each day, display lecture times for that subject
    const lectureTimes = subject.lectures.join("    ");
    doc.text(
      lectureTimes,
      startX + subjectColumnWidths.subject + 10,
      startY + 5
    );

    // Draw row border
    doc
      .lineWidth(1)
      .moveTo(startX - 20, startY + rowHeight)
      .lineTo(
        startX +
          Object.values(subjectColumnWidths).reduce(
            (acc, width) => acc + width,
            0
          ) +
          158,
        startY + rowHeight
      )
      .stroke();
  });

  // Draw table bottom border
  doc
    .lineWidth(1)
    .moveTo(startX, startY + rowHeight)
    .lineTo(
      startX +
        Object.values(subjectColumnWidths).reduce(
          (acc, width) => acc + width,
          0
        ),
      startY + rowHeight
    )
    .stroke();

  // End the document
  doc.end();
};

module.exports = generatePDF;

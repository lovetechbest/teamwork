import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Export daily reports to Word document
 * @param {Array} reports - Array of report objects with { fullName, userName, text, require, date }
 * @param {string} date - Date string in yyyy-mm-dd format
 */
export const exportReportsToWord = async (reports, date) => {
  if (!reports || reports.length === 0) {
    alert('No reports to export');
    return;
  }

  // Create table rows
  const tableRows = [
    // Header row
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Username', bold: true })],
            alignment: AlignmentType.CENTER,
          })],
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Report Content', bold: true })],
            alignment: AlignmentType.CENTER,
          })],
          width: { size: 50, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Requirement', bold: true })],
            alignment: AlignmentType.CENTER,
          })],
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
      ],
    }),
    // Data rows
    ...reports.map((report) => {
      const username = report.fullName || report.userName || 'Unknown';
      const content = report.text || report.main_content || report.content || '—';
      const requirement = report.require || report.requirement || '—';

      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: username })],
              alignment: AlignmentType.LEFT,
            })],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: content })],
              alignment: AlignmentType.LEFT,
            })],
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: requirement })],
              alignment: AlignmentType.LEFT,
            })],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
        ],
      });
    }),
  ];

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: `Daily Reports - ${date}`,
            heading: 'Heading1',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          // Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  // Generate and download the document
  try {
    const blob = await Packer.toBlob(doc);
    const fileName = `${date}.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating Word document:', error);
    alert('Failed to generate Word document. Please try again.');
  }
};

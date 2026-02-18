import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Helper function to preserve line breaks and spaces in text
 * Splits text by newlines and creates multiple paragraphs
 */
const createParagraphsWithLineBreaks = (text, fontSize = 24) => {
  if (!text || text === '—') {
    return [new Paragraph({
      children: [new TextRun({ text: text || '—', size: fontSize })],
      alignment: AlignmentType.LEFT,
    })];
  }

  // Split by newlines (\n, \r\n, or \r)
  const lines = text.split(/\r?\n|\r/);
  
  return lines.map((line, index) => {
    // Preserve spaces by not trimming
    return new Paragraph({
      children: [new TextRun({ text: line, size: fontSize })],
      alignment: AlignmentType.LEFT,
      spacing: index > 0 ? { before: 120 } : undefined, // Add spacing between lines
    });
  });
};

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

  // Font sizes (default is 22, so 2 sizes bigger = 26)
  const headerFontSize = 28;
  const bodyFontSize = 26;

  // Create table rows
  const tableRows = [
    // Header row with darker background
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Username', bold: true, size: headerFontSize })],
            alignment: AlignmentType.CENTER,
          })],
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: 'D3D3D3' },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Report Content', bold: true, size: headerFontSize })],
            alignment: AlignmentType.CENTER,
          })],
          width: { size: 55, type: WidthType.PERCENTAGE },
          shading: { fill: 'D3D3D3' },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Requirement', bold: true, size: headerFontSize })],
            alignment: AlignmentType.CENTER,
          })],
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: 'D3D3D3' },
        }),
      ],
    }),
    // Data rows with striping
    ...reports.map((report, index) => {
      const username = report.fullName || report.userName || 'Unknown';
      const content = report.text || report.main_content || report.content || '—';
      const requirement = report.require || report.requirement || '—';

      // Alternate row colors for striping (even rows get light gray)
      const isEvenRow = index % 2 === 0;
      const rowShading = isEvenRow ? { fill: 'F5F5F5' } : undefined;

      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: username, size: bodyFontSize })],
              alignment: AlignmentType.LEFT,
            })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: rowShading,
          }),
          new TableCell({
            children: createParagraphsWithLineBreaks(content, bodyFontSize),
            width: { size: 55, type: WidthType.PERCENTAGE },
            shading: rowShading,
          }),
          new TableCell({
            children: createParagraphsWithLineBreaks(requirement, bodyFontSize),
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: rowShading,
          }),
        ],
      });
    }),
  ];

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 inch (in twips, 1 inch = 1440 twips)
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Title with bigger font
          new Paragraph({
            children: [new TextRun({ text: `Daily Reports - ${date}`, bold: true, size: 32 })],
            heading: 'Heading1',
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),
          // Table - bigger width with column widths
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [convertInchesToTwip(2), convertInchesToTwip(5.5), convertInchesToTwip(2.5)],
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

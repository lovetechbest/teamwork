import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, convertInchesToTwip, BorderStyle, TableBorders, VerticalAlignTable } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Helper function to create paragraphs with first word bold and remove blank lines
 * Splits text by newlines, filters blank lines, and makes first word of each sentence bold
 * @param {string} text - Text content
 * @param {number} fontSize - Font size in half-points
 * @param {boolean} centerAlign - Whether to center align text (default: false)
 * @param {string} fontFamily - Font family name (default: 'Segoe UI')
 */
const createParagraphsWithLineBreaks = (text, fontSize = 24, centerAlign = false, fontFamily = 'Segoe UI') => {
  const alignment = centerAlign ? AlignmentType.CENTER : AlignmentType.LEFT;
  
  if (!text || text === '—') {
    return [new Paragraph({
      children: [new TextRun({ text: text || '—', size: fontSize, font: fontFamily })],
      alignment: alignment,
      spacing: { after: 100 },
    })];
  }

  // Split by newlines (\n, \r\n, or \r) and filter out blank lines
  const lines = text.split(/\r?\n|\r/)
    .map(line => line.trim()) // Trim whitespace
    .filter(line => line.length > 0); // Remove blank lines
  
  if (lines.length === 0) {
    return [new Paragraph({
      children: [new TextRun({ text: '—', size: fontSize, font: fontFamily })],
      alignment: alignment,
      spacing: { after: 100 },
    })];
  }
  
  return lines.map((line, index) => {
    // Split line into words
    const words = line.split(/\s+/);
    
    if (words.length === 0) {
      return new Paragraph({
        children: [new TextRun({ text: '—', size: fontSize, font: fontFamily })],
        alignment: alignment,
        spacing: index > 0 ? { before: 100 } : { after: 100 },
      });
    }
    
    const textRuns = [];
    
    // First word is bold
    textRuns.push(new TextRun({ 
      text: words[0] + (words.length > 1 ? ' ' : ''), 
      bold: true, 
      size: fontSize, 
      font: fontFamily 
    }));
    
    // Rest of the words
    if (words.length > 1) {
      const restOfLine = words.slice(1).join(' ');
      textRuns.push(new TextRun({ 
        text: restOfLine, 
        size: fontSize, 
        font: fontFamily 
      }));
    }
    
    return new Paragraph({
      children: textRuns,
      alignment: alignment,
      spacing: index > 0 ? { before: 100 } : { after: 100 },
    });
  });
};

/**
 * Export daily reports to Word document
 * @param {Array} reports - Array of report objects with { fullName, userName, text, require, date }
 * @param {string} date - Date string in yyyy-mm-dd format (exact date to use, no modification)
 */
export const exportReportsToWord = async (reports, date) => {
  if (!reports || reports.length === 0) {
    alert('No reports to export');
    return;
  }

  // Professional color scheme
  const headerBgColor = '4472C4'; // Professional blue
  const headerTextColor = 'FFFFFF'; // White text
  const evenRowColor = 'F2F2F2'; // Light gray for striping
  const oddRowColor = 'FFFFFF'; // White
  
  // Font family
  const fontFamily = 'Segoe UI';
  
  // Font sizes (default is 22, so 2 sizes bigger = 26)
  const headerFontSize = 28;
  const bodyFontSize = 26;

  // Professional table borders
  const tableBorders = new TableBorders({
    top: { style: BorderStyle.SINGLE, size: 12, color: '4472C4' },
    bottom: { style: BorderStyle.SINGLE, size: 12, color: '4472C4' },
    left: { style: BorderStyle.SINGLE, size: 6, color: 'D0D0D0' },
    right: { style: BorderStyle.SINGLE, size: 6, color: 'D0D0D0' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0' },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0' },
  });

  // Create table rows
  const tableRows = [
    // Header row with professional blue background
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Username', bold: true, size: headerFontSize, color: headerTextColor, font: fontFamily })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          })],
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: headerBgColor },
          margins: { top: convertInchesToTwip(0.05), bottom: convertInchesToTwip(0.05), left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1) },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Report Content', bold: true, size: headerFontSize, color: headerTextColor, font: fontFamily })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          })],
          width: { size: 55, type: WidthType.PERCENTAGE },
          shading: { fill: headerBgColor },
          margins: { top: convertInchesToTwip(0.05), bottom: convertInchesToTwip(0.05), left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1) },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Other', bold: true, size: headerFontSize, color: headerTextColor, font: fontFamily })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          })],
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: headerBgColor },
          margins: { top: convertInchesToTwip(0.05), bottom: convertInchesToTwip(0.05), left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1) },
        }),
      ],
    }),
    // Data rows with professional striping
    ...reports.map((report, index) => {
      const username = report.fullName || report.userName || 'Unknown';
      const content = report.text || report.main_content || report.content || '—';
      const requirement = report.require || report.requirement || '—';

      // Alternate row colors for striping
      const isEvenRow = index % 2 === 0;
      const rowShading = { fill: isEvenRow ? evenRowColor : oddRowColor };

      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: username, size: bodyFontSize, font: fontFamily })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 100, after: 100 },
            })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: rowShading,
            margins: { top: convertInchesToTwip(0.05), bottom: convertInchesToTwip(0.05), left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1) },
            verticalAlign: VerticalAlignTable.CENTER,
          }),
          new TableCell({
            children: createParagraphsWithLineBreaks(content, bodyFontSize, false, fontFamily),
            width: { size: 55, type: WidthType.PERCENTAGE },
            shading: rowShading,
            margins: { top: convertInchesToTwip(0.05), bottom: convertInchesToTwip(0.05), left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1) },
            verticalAlign: VerticalAlignTable.TOP,
          }),
          new TableCell({
            children: createParagraphsWithLineBreaks(requirement, bodyFontSize, true, fontFamily),
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: rowShading,
            margins: { top: convertInchesToTwip(0.05), bottom: convertInchesToTwip(0.05), left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1) },
            verticalAlign: VerticalAlignTable.CENTER,
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
          // Title with professional styling
          new Paragraph({
            children: [new TextRun({ text: `Daily Reports - ${date}`, bold: true, size: 36, color: '4472C4', font: fontFamily })],
            heading: 'Heading1',
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
          }),
          // Professional table with borders and styling
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [convertInchesToTwip(2), convertInchesToTwip(5.5), convertInchesToTwip(2.5)],
            borders: tableBorders,
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  // Generate and download the document
  try {
    const blob = await Packer.toBlob(doc);
    const fileName = `${date}.docx`; // Use exact date for filename
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating Word document:', error);
    alert('Failed to generate Word document. Please try again.');
  }
};

import React, { useState } from 'react';

function DailyReport() {
  const [reportText, setReportText] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [reports, setReports] = useState([]);

  const handleTextChange = (e) => setReportText(e.target.value);
  const handleDateChange = (e) => setDateValue(e.target.value);

  const handleReport = () => {
    if (!reportText || !dateValue) {
      alert('Please enter a report and select a date!');
      return;
    }
    const newReport = { text: reportText, date: dateValue };
    setReports([newReport, ...reports]);
    setReportText('');
    setDateValue('');
  };

  return (
    <div className="daily-report">
      <h2>📋 Daily Report</h2>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="date"
          value={dateValue}
          onChange={handleDateChange}
          className="date-picker"
        />

        <textarea
          placeholder="Write your report here..."
          value={reportText}
          onChange={handleTextChange}
          rows={5}
          className="report-textarea"
        />

        <button onClick={handleReport} className="report-button">
          Submit Report
        </button>
      </div>

      {/* Report List */}
      <div className="report-list">
        {reports.length === 0 ? (
          <p className="no-reports">No reports yet. Start writing one!</p>
        ) : (
          reports.map((report, index) => (
            <div key={index} className="report-item">
              <div className="report-header">
                <span className="report-date">{report.date}</span>
              </div>
              <p className="report-text">{report.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DailyReport;

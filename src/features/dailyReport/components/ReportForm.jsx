import React from 'react';
import './ReportForm.css';

const ReportForm = ({ 
  today, 
  reportText, 
  isEditingToday, 
  errorMessage,
  onTextChange, 
  onSubmit 
}) => {
  return (
    <div className="report-form">
      <div className="input-section">
        <input
          type="date"
          value={today}
          disabled
          className="date-picker"
        />

        <textarea
          placeholder="Write today's report..."
          value={reportText}
          onChange={onTextChange}
          rows={5}
          className="report-textarea"
          disabled={!isEditingToday}
        />

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <button
          onClick={onSubmit}
          className="report-button"
          disabled={!isEditingToday}
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default ReportForm;

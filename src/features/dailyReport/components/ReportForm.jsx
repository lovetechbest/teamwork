import React from 'react';
import './ReportForm.css';

const ReportForm = ({ 
  today, 
  reportText, 
  isEditingToday, 
  errorMessage,
  loading = false,
  onTextChange, 
  onSubmit,
  isModifying = false,
  compact = false
}) => {
  return (
    <div className={`report-form ${compact ? 'report-form-compact' : ''}`}>
      <div className="input-section">
        <label className="server-day-label">
          Server day: <span className="server-day-value">{today || (loading ? '…' : '—')}</span>
        </label>
        <input
          type="date"
          value={today || ''}
          disabled
          className="date-picker"
        />

        <textarea
          placeholder={loading ? "Loading today's report..." : "Write today's report..."}
          value={reportText}
          onChange={onTextChange}
          rows={compact ? 3 : 5}
          className="report-textarea"
          disabled={!isEditingToday || loading}
        />

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <button
          onClick={onSubmit}
          className="report-button"
          disabled={!isEditingToday || loading}
        >
          {loading ? "Loading..." : isModifying ? "Update Report" : "Submit Report"}
        </button>
      </div>
    </div>
  );
};

export default ReportForm;

import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useDailyReportStats } from '../../../features/dailyReport/hooks/useDailyReportStats';
import '../../../styles/dash-board/dash/developer-daily-report.css';

export default function DailyReport() {
  const { reportedCount, notReportedCount, loading, error } = useDailyReportStats();
  const hasReported = reportedCount > 0;

  return (
    <div className="card">
      <h3>Daily Report</h3>
      <div className="daily-report-content">
        <img src="/dash-board/daily_report.png" alt="Daily Report" className="card-image" />
        {error && <p className="daily-report-error">{error}</p>}
        <div className="daily-report-status">
          <div className={`status-indicator ${hasReported ? 'reported' : 'not-reported'}`}>
            {hasReported ? (
              <>
                <FaCheckCircle className="status-icon check-icon" />
                <div className="label">Reported Today</div>
              </>
            ) : (
              <>
                <FaTimesCircle className="status-icon no-check-icon" />
                <div className="label">Not Reported</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

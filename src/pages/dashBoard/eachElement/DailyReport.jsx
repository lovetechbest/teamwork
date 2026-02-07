import React from 'react';
import { useDailyReportStats } from '../../../features/dailyReport/hooks/useDailyReportStats';

export default function DailyReport() {
  const { reportedCount, notReportedCount, loading, error } = useDailyReportStats();

  return (
    <div className="card">
      <h3>Daily Report</h3>
      <div className="daily-report-content">
        <img src="/dash-board/daily_report.png" alt="Daily Report" className="card-image" />
        {error && <p className="daily-report-error">{error}</p>}
        <div className="daily-report-announcements">
          <div className="announcement reported">
            <div className="count">{loading ? '—' : reportedCount}</div>
            <div className="label">Reported</div>
          </div>
          <div className="announcement not-reported">
            <div className="count">{loading ? '—' : notReportedCount}</div>
            <div className="label">Not Reported</div>
          </div>
        </div>
      </div>
    </div>
  );
}

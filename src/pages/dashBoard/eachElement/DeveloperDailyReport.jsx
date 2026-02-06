import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../../../styles/dash-board/dash/developer-daily-report.css';

export default function DeveloperDailyReport() {
  const [hasReportedToday, setHasReportedToday] = useState(false);

  useEffect(() => {
    const checkTodayReport = () => {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem('dailyReports');
      if (saved) {
        try {
          const reports = JSON.parse(saved);
          const todayReport = reports.find(r => r.date === today);
          setHasReportedToday(!!todayReport);
        } catch (e) {
          setHasReportedToday(false);
        }
      } else {
        setHasReportedToday(false);
      }
    };

    checkTodayReport();
    
    const interval = setInterval(checkTodayReport, 5000);
    
    const handleStorageChange = (e) => {
      if (e.key === 'dailyReports' || !e.key) {
        checkTodayReport();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const customEvent = new CustomEvent('localStorageChange');
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(...args) {
      originalSetItem.apply(this, args);
      if (args[0] === 'dailyReports') {
        window.dispatchEvent(customEvent);
      }
    };
    
    window.addEventListener('localStorageChange', checkTodayReport);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', checkTodayReport);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  return (
    <div className="card">
      <h3>Daily Report</h3>
      <div className="daily-report-content">
        <img src="/dash-board/daily_report.png" alt="Daily Report" className="card-image" />
        <div className="daily-report-status">
          <div className={`status-indicator ${hasReportedToday ? 'reported' : 'not-reported'}`}>
            {hasReportedToday ? (
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

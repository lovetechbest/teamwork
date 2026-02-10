import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getUserId } from '../../../store/auth/authStorage';
import { fetchReportForDate, getServerDay } from '../../../store/reports/reportActions';
import '../../../styles/dash-board/dash/developer-daily-report.css';

const STORAGE_KEY = 'dailyReports';
const getStorageKey = (userId) => userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;

const parseDate = (str) => {
  const [y, m, d] = str.split('-').map(Number);
  const d2 = new Date(y, m - 1, d);
  d2.setDate(d2.getDate() - 1);
  return d2.toISOString().split('T')[0];
};

export default function DeveloperDailyReport() {
  const [hasReportedToday, setHasReportedToday] = useState(false);
  const [today, setToday] = useState('');
  const [yesterdayStr, setYesterdayStr] = useState('');
  const dispatch = useDispatch();
  const { userId, user } = useSelector(state => state.auth);
  const currentUserId = userId || user?.id || user?.userID || getUserId();
  const storageKey = getStorageKey(currentUserId);

  useEffect(() => {
    getServerDay().then((serverToday) => {
      setToday(serverToday);
      setYesterdayStr(parseDate(serverToday));
    });
  }, []);

  const checkTodayReport = (reports) => {
    if (!reports || !Array.isArray(reports)) return false;
    return reports.some(r => r.date === today || r.date === yesterdayStr);
  };

  useEffect(() => {
    if (!yesterdayStr) return;
    const loadFromServer = async () => {
      if (!currentUserId) {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            const reports = JSON.parse(saved);
            setHasReportedToday(checkTodayReport(reports));
          } catch {
            setHasReportedToday(false);
          }
        }
        return;
      }
      try {
        const [todayReport, yesterdayReport] = await Promise.all([
          dispatch(fetchReportForDate(today, currentUserId)),
          dispatch(fetchReportForDate(yesterdayStr, currentUserId)),
        ]);
        if (todayReport || yesterdayReport) {
          setHasReportedToday(true);
          return;
        }
      } catch {
        // ignore
      }
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const reports = JSON.parse(saved);
          setHasReportedToday(checkTodayReport(reports));
        } catch {
          setHasReportedToday(false);
        }
      } else {
        setHasReportedToday(false);
      }
    };
    loadFromServer();
    const doCheck = () => {
      const saved = localStorage.getItem(storageKey);
      let reports = [];
      if (saved) {
        try {
          reports = JSON.parse(saved);
        } catch {}
      }
      setHasReportedToday(checkTodayReport(reports));
    };
    doCheck();
    const interval = setInterval(doCheck, 3000);

    const handleStorageChange = (e) => {
      if (!e.key || e.key.startsWith('dailyReports')) doCheck();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', doCheck);

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (...args) {
      originalSetItem.apply(this, args);
      if (args[0] && String(args[0]).startsWith('dailyReports')) {
        window.dispatchEvent(new Event('localStorageChange'));
      }
    };

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', doCheck);
      localStorage.setItem = originalSetItem;
    };
  }, [storageKey, currentUserId, today, yesterdayStr, dispatch]);

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

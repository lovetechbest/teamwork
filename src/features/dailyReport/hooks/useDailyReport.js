import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserId } from '../../../store/auth/authStorage';
import { fetchReportForDate, fetchReportHistory, getServerDay } from '../../../store/reports/reportActions';

const STORAGE_KEY = 'dailyReports';

const getStorageKey = (userId) => userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;

export const useDailyReport = (options = {}) => {
  const { alwaysEditable = false } = options;
  const dispatch = useDispatch();
  const { userId, user } = useSelector(state => state.auth);
  const [today, setToday] = useState(null);
  const currentUserId = userId || user?.id || user?.userID || getUserId();
  const storageKey = getStorageKey(currentUserId);
  
  const [reportText, setReportText] = useState('');
  const [isEditingToday, setIsEditingToday] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingToday, setLoadingToday] = useState(true);
  const [reports, setReports] = useState([]);

  // Single effect: use server day for "today", then load reports
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoadingToday(true);
      try {
        const serverToday = await getServerDay();
        if (cancelled) return;
        setToday(serverToday);
        if (!currentUserId) {
          setLoadingToday(false);
          return;
        }
        const [report, history] = await Promise.all([
          dispatch(fetchReportForDate(serverToday, currentUserId)),
          fetchReportHistory(currentUserId, 90, serverToday),
        ]);
        let mergedReports;
        let todayText = '';
        let hasTodayReport = false;
        if (report) {
          todayText = report.main_content || report.content || report.text || '';
          hasTodayReport = true;
          const newReport = { id: Date.now(), reportId: report._id || report.id, date: serverToday, text: todayText, createdAt: report.createdAt, updatedAt: report.updatedAt };
          const filtered = (history.length > 0 ? history : []).filter(r => r.date !== serverToday);
          mergedReports = [newReport, ...filtered];
        } else if (history.length > 0) {
          mergedReports = history;
          const todayReport = history.find(r => r.date === serverToday);
          hasTodayReport = !!todayReport;
          if (todayReport) todayText = todayReport.text;
        } else {
          mergedReports = [];
        }
        setReports(mergedReports);
        setReportText(todayText);
        if (!alwaysEditable) setIsEditingToday(!hasTodayReport);
      } catch (e) {
        // keep existing state
      } finally {
        if (!cancelled) setLoadingToday(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [dispatch, alwaysEditable, storageKey, currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reports));
    } catch (e) {
      // Failed to save to localStorage
    }
  }, [reports, storageKey]);

  useEffect(() => {
    if (alwaysEditable) return;
    const todayReport = reports.find(r => r.date === today);
    if (todayReport) {
      setReportText(todayReport.text);
      setIsEditingToday(false);
    }
  }, [reports, today, alwaysEditable]);

  const handleTextChange = (e) => {
    if (!isEditingToday) return;
    setReportText(e.target.value);
  };

  const enableModify = () => {
    setIsEditingToday(true);
  };

  const addReport = (text, reportId, createdAt = null, updatedAt = null) => {
    if (!today) return;
    const newReport = { id: Date.now(), reportId, date: today, text, createdAt, updatedAt };
    setReports(prev => [newReport, ...prev.filter(r => r.date !== today)]);
    setIsEditingToday(false);
    setErrorMessage('');
  };

  return {
    today,
    reportText,
    isEditingToday,
    errorMessage,
    reports,
    currentUserId,
    loadingToday,
    setErrorMessage,
    setReportText,
    handleTextChange,
    enableModify,
    addReport,
  };
};

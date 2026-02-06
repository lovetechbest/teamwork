import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReportForDate } from '../../../store/reports/reportActions';

const STORAGE_KEY = 'dailyReports';

const getStorageKey = (userId) => userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;

export const useDailyReport = (options = {}) => {
  const { alwaysEditable = false } = options;
  const dispatch = useDispatch();
  const { userId, user } = useSelector(state => state.auth);
  const today = new Date().toISOString().split('T')[0];
  const currentUserId = userId || user?.id || user?.userID || sessionStorage.getItem("userId");
  const storageKey = getStorageKey(currentUserId);
  
  const [reportText, setReportText] = useState('');
  const [isEditingToday, setIsEditingToday] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingToday, setLoadingToday] = useState(true);
  const [reports, setReports] = useState([]);

  // Reload from correct storage when user changes (e.g. after login/logout)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setReports(saved ? JSON.parse(saved) : []);
    } catch {
      setReports([]);
    }
  }, [storageKey]);

  // Fetch today's report from backend on load (developer can see what they submitted and modify)
  useEffect(() => {
    const loadTodayReport = async () => {
      setLoadingToday(true);
      try {
        const report = await dispatch(fetchReportForDate(today, currentUserId));
        if (report) {
          const text = report.main_content || report.content || report.text;
          const reportId = report._id || report.id;
          setReports(prev => {
            const filtered = prev.filter(r => r.date !== today);
            const newReport = { id: Date.now(), reportId, date: today, text };
            return [newReport, ...filtered];
          });
          setReportText(text);
          if (!alwaysEditable) setIsEditingToday(false);
        } else {
          // Server has no report (e.g. deleted) - clear cached report and allow writing
          setReports(prev => prev.filter(r => r.date !== today));
          setReportText('');
          setIsEditingToday(true);
        }
      } catch (e) {
        setReports(prev => prev.filter(r => r.date !== today));
        setReportText('');
        setIsEditingToday(true);
      } finally {
        setLoadingToday(false);
      }
    };
    loadTodayReport();
  }, [today, dispatch, alwaysEditable, storageKey, currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reports));
    } catch (e) {
      console.warn('Failed to save reports to localStorage', e);
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

  const addReport = (text, reportId) => {
    const newReport = { id: Date.now(), reportId, date: today, text };
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

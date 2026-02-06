import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useDailyReport = () => {
  const { userId, user } = useSelector(state => state.auth);
  const today = new Date().toISOString().split('T')[0];
  
  const [reportText, setReportText] = useState('');
  const [isEditingToday, setIsEditingToday] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('dailyReports');
    return saved ? JSON.parse(saved) : [];
  });

  const currentUserId = userId || user?.id || user?.userID || sessionStorage.getItem("userId");

  useEffect(() => {
    localStorage.setItem('dailyReports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    const todayReport = reports.find(r => r.date === today);
    if (todayReport) {
      setReportText(todayReport.text);
      setIsEditingToday(false);
    }
  }, [reports, today]);

  const handleTextChange = (e) => {
    if (!isEditingToday) return;
    setReportText(e.target.value);
  };

  const enableModify = () => {
    setIsEditingToday(true);
  };

  const addReport = (text) => {
    const newReport = { id: Date.now(), date: today, text };
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
    setErrorMessage,
    handleTextChange,
    enableModify,
    addReport,
  };
};

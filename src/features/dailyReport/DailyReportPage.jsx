import React from 'react';
import { useDispatch } from 'react-redux';
import { submitDailyReport, updateDailyReport, fetchReportForDate } from '../../store/reports/reportActions';
import { useDailyReport } from './hooks/useDailyReport';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import { FaFileAlt } from 'react-icons/fa';
import './DailyReportPage.css';

const DailyReportPage = () => {
  const dispatch = useDispatch();
  const {
    today,
    reportText,
    isEditingToday,
    errorMessage,
    reports,
    currentUserId,
    loadingToday,
    setErrorMessage,
    handleTextChange,
    enableModify,
    addReport,
  } = useDailyReport();

  // Check if today's report already exists
  const existingReport = reports.find(r => r.date === today);

  const handleReport = async () => {
    if (!today) return;
    if (!reportText.trim()) {
      alert("Please enter today's report!");
      return;
    }

    let finalUserId = currentUserId;
    
    if (!finalUserId) {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            finalUserId = payload.id || payload.userId || payload.userID || payload.sub;
            if (finalUserId) {
              sessionStorage.setItem("userId", finalUserId);
            }
          }
        } catch (e) {
          // Could not decode token
        }
      }
    }

    if (!finalUserId) {
      alert("User ID not found. Please login again.");
      return;
    }

    const payload = {
      date: today,
      id: finalUserId,
      main_content: reportText,
    };

    setErrorMessage('');
    
    const getReportId = () => existingReport?.reportId || existingReport?._id || existingReport?.id;

    try {
      let result;
      
      // If report exists with reportId, use update endpoint
      const reportId = getReportId();
      if (reportId) {
        result = await dispatch(updateDailyReport(reportId, payload));
      } else {
        // First time submitting today - try to create new report
        result = await dispatch(submitDailyReport(payload));
        
        // If create fails with "already exists" error, fetch report ID and try update
        if (!result) {
          const errorMsg = sessionStorage.getItem("lastReportError") || "";
          const lowerMsg = errorMsg.toLowerCase();
          if (lowerMsg.includes("already") || 
              lowerMsg.includes("exist") || 
              lowerMsg.includes("one report") ||
              lowerMsg.includes("per day") ||
              lowerMsg.includes("only create one")) {
            sessionStorage.removeItem("lastReportError");
            setErrorMessage("");
            const report = await dispatch(fetchReportForDate(today, finalUserId));
            const fetchedId = report?._id || report?.id;
            if (fetchedId) {
              result = await dispatch(updateDailyReport(fetchedId, payload));
            }
            if (result) {
              addReport(reportText, result._id || result.id);
              return;
            }
          }
        }
      }
      
      if (!result) {
        const errorMsg = sessionStorage.getItem("lastReportError") || "Failed to submit report";
        setErrorMessage(errorMsg);
        return;
      }

      addReport(reportText, result._id || result.id);
    } catch (error) {
      const errorMsg = error.message || "Failed to submit report. Please try again.";
      setErrorMessage(errorMsg);
      alert(errorMsg);
    }
  };

  return (
    <div className="daily-report">
      <h2>
        <span className="title-icon">
          <FaFileAlt />
        </span>
        Daily Report
      </h2>

      <ReportForm
        today={today}
        reportText={reportText}
        isEditingToday={isEditingToday}
        errorMessage={errorMessage}
        loading={loadingToday}
        onTextChange={handleTextChange}
        onSubmit={handleReport}
        isModifying={!!existingReport && isEditingToday}
      />

      <ReportList
        reports={reports}
        today={today}
        onModify={enableModify}
      />
    </div>
  );
};

export default DailyReportPage;

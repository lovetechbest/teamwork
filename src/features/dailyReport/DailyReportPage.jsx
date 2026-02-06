import React from 'react';
import { useDispatch } from 'react-redux';
import { submitDailyReport } from '../../store/reports/reportActions';
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
    setErrorMessage,
    handleTextChange,
    enableModify,
    addReport,
  } = useDailyReport();

  const handleReport = async () => {
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
          console.error("Error decoding token:", e);
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
    
    try {
      const result = await dispatch(submitDailyReport(payload));
      
      if (!result) {
        return;
      }

      addReport(reportText);
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
        onTextChange={handleTextChange}
        onSubmit={handleReport}
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

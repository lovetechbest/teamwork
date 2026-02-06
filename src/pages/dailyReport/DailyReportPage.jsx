import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitDailyReport } from '../../actions/reportActions';
import { FaFileAlt, FaChartLine } from 'react-icons/fa';

function DailyReport() {
  const dispatch = useDispatch();
  const { userId, user } = useSelector(state => state.auth);
  
  // Get user ID from Redux state or sessionStorage as fallback
  const currentUserId = userId || user?.id || user?.userID || sessionStorage.getItem("userId");
  
  // Debug logging
  useEffect(() => {
    console.log("DailyReport - userId from Redux:", userId);
    console.log("DailyReport - user from Redux:", user);
    console.log("DailyReport - userId from sessionStorage:", sessionStorage.getItem("userId"));
    console.log("DailyReport - currentUserId:", currentUserId);
  }, [userId, user, currentUserId]);

  // Today (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // Input state
  const [reportText, setReportText] = useState('');
  const [isEditingToday, setIsEditingToday] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Reports state (load from localStorage)
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('dailyReports');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist reports locally
  useEffect(() => {
    localStorage.setItem('dailyReports', JSON.stringify(reports));
  }, [reports]);

  // Load today's report if exists
  useEffect(() => {
    const todayReport = reports.find(r => r.date === today);
    if (todayReport) {
      setReportText(todayReport.text);
      setIsEditingToday(false); // lock input
    }
  }, [reports, today]);

  const handleTextChange = (e) => {
    if (!isEditingToday) return;
    setReportText(e.target.value);
  };

  const handleReport = async () => {
    if (!reportText.trim()) {
      alert("Please enter today's report!");
      return;
    }

    // Try to get user ID from multiple sources
    let finalUserId = currentUserId;
    
    if (!finalUserId) {
      // Try to get from token if available
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            finalUserId = payload.id || payload.userId || payload.userID || payload.sub;
            if (finalUserId) {
              sessionStorage.setItem("userId", finalUserId);
              console.log("Extracted userId from token:", finalUserId);
            }
          }
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }
    }

    if (!finalUserId) {
      alert("User ID not found. Please login again.");
      console.error("User ID not found. Available data:", {
        userId,
        user,
        sessionStorageUserId: sessionStorage.getItem("userId"),
        token: sessionStorage.getItem("accessToken") ? "exists" : "missing"
      });
      return;
    }

    const payload = {
      date: today,
      id: finalUserId,
      main_content: reportText,
    };

    console.log("Submitting report with payload:", payload);
    setErrorMessage('');
    
    try {
      const result = await dispatch(submitDailyReport(payload));
      console.log("Report submit result:", result);
      
      if (!result) {
        // Error was already dispatched, check console for details
        // The error message should be in the console from reportActions
        return;
      }

      // Success - update localStorage / UI
      const newReport = { id: Date.now(), date: today, text: reportText };
      setReports(prev => [newReport, ...prev.filter(r => r.date !== today)]);
      setIsEditingToday(false); // lock textarea after submit
      setErrorMessage(''); // Clear any previous errors
    } catch (error) {
      // This will catch if the action throws an error
      const errorMsg = error.message || "Failed to submit report. Please try again.";
      setErrorMessage(errorMsg);
      alert(errorMsg);
    }
  };


  const enableModify = () => {
    setIsEditingToday(true);
  };

  return (
    <div className="daily-report">
      <h2>
        <span className="title-icon">
          <FaFileAlt />
        </span>
        Daily Report
      </h2>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="date"
          value={today}
          disabled
          className="date-picker"
        />

        <textarea
          placeholder="Write today's report..."
          value={reportText}
          onChange={handleTextChange}
          rows={5}
          className="report-textarea"
          disabled={!isEditingToday}
        />

        {errorMessage && (
          <div className="error-message" style={{
            color: '#ff4757',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 71, 87, 0.1)',
            border: '1px solid rgba(255, 71, 87, 0.3)',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleReport}
          className="report-button"
          disabled={!isEditingToday}
        >
          Submit Report
        </button>
      </div>

      {/* Report List */}
      <div className="report-list">
        {reports.length === 0 ? (
          <p className="no-reports">No reports yet.</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="report-item">
              <div className="report-header">
                <span className="report-date">{report.date}</span>

                {report.date === today && !isEditingToday && (
                  <button
                    className="modify-btn"
                    onClick={enableModify}
                  >
                    ✏️ Modify
                  </button>
                )}
              </div>

              <p className="report-text">{report.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DailyReport;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useManagerDailyReports } from './hooks/useManagerDailyReports';
import { useDailyReport } from './hooks/useDailyReport';
import { deleteDailyReports, submitDailyReport, updateDailyReport, fetchReportForDate } from '../../store/reports/reportActions';
import ReportForm from './components/ReportForm';
import { FaUsers, FaTrash } from 'react-icons/fa';
import './DailyReportPage.css';
import './ManagerDailyReportPage.css';

const getDefaultDates = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
};

const formatDateTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
};

const ManagerDailyReportPage = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState(getDefaultDates);
  const { reports, loading, error, refreshReports } = useManagerDailyReports(dateRange);
  const [deleting, setDeleting] = useState(null);

  const {
    today,
    reportText,
    isEditingToday,
    errorMessage,
    reports: myReports,
    currentUserId,
    loadingToday,
    setErrorMessage,
    handleTextChange,
    addReport,
  } = useDailyReport({ alwaysEditable: true });

  const existingReport = myReports.find((r) => r.date === today);

  // Manager/TeamLeader: create or update (backend allows one per day) - same flow as developer
  const handleReport = async () => {
    if (!reportText.trim()) {
      alert("Please enter your report!");
      return;
    }
    let finalUserId = currentUserId;
    if (!finalUserId) {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        try {
          const tokenParts = token.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            finalUserId = payload.id || payload.userId || payload.userID || payload.sub;
            if (finalUserId) sessionStorage.setItem("userId", finalUserId);
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
    const payload = { date: today, id: finalUserId, main_content: reportText };
    setErrorMessage("");
    const getReportId = () => existingReport?.reportId || existingReport?._id || existingReport?.id;
    try {
      let result;
      const reportId = getReportId();
      if (reportId) {
        result = await dispatch(updateDailyReport(reportId, payload));
      } else {
        result = await dispatch(submitDailyReport(payload));
        if (!result) {
          const errorMsg = sessionStorage.getItem("lastReportError") || "";
          const lowerMsg = errorMsg.toLowerCase();
          if (
            lowerMsg.includes("already") ||
            lowerMsg.includes("exist") ||
            lowerMsg.includes("one report") ||
            lowerMsg.includes("per day") ||
            lowerMsg.includes("only create one")
          ) {
            sessionStorage.removeItem("lastReportError");
            setErrorMessage("");
            const report = await dispatch(fetchReportForDate(today, finalUserId));
            const fetchedId = report?._id || report?.id;
            if (fetchedId) result = await dispatch(updateDailyReport(fetchedId, payload));
            if (result) {
              addReport(reportText, result._id || result.id);
              await refreshReports();
              return;
            }
          }
        }
      }
      if (!result) {
        const errMsg = sessionStorage.getItem("lastReportError") || "Failed to submit report";
        const hint = errMsg.toLowerCase().includes("one report") || errMsg.toLowerCase().includes("per day")
          ? " Try refreshing the page to load your report, then Update to modify it."
          : "";
        setErrorMessage(errMsg + hint);
        return;
      }
      addReport(reportText, result._id || result.id);
      await refreshReports();
    } catch (e) {
      alert(e.message || "Failed to submit report. Please try again.");
    }
  };

  const flatReports = reports
    .map((r) => {
      const userId = typeof r.user === 'object' ? r.user?._id || r.user?.uniqueID : (r.user || r.userId || r.user_id || r.id);
      const userName = (typeof r.user === 'object' && r.user?.userID) ||
        r.userName || r.user_name || r.name ||
        (typeof r.user === 'object' ? r.user?.name : null) ||
        (userId ? `User ${String(userId).slice(-8)}` : 'Unknown');
      const reportDate = r.date ? (typeof r.date === 'string' && r.date.includes('T') ? r.date.split('T')[0] : r.date) : null;
      return {
        id: r._id || r.id,
        userId,
        userName,
        date: reportDate,
        text: r.main_content || r.content || r.text,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    })
    .filter((r) => r.id)
    .filter((r) => String(r.userId) !== String(currentUserId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDelete = async (reportId) => {
    if (!window.confirm('Delete this report?')) return;
    setDeleting(reportId);
    try {
      const result = await dispatch(deleteDailyReports([reportId]));
      if (result?.ok) {
        await refreshReports();
      } else {
        alert(result?.message || 'Failed to delete report.');
      }
    } catch (e) {
      alert('Failed to delete report.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="daily-report manager-daily-report">
      <div className="report-header compact">
        <h2>
          <span className="title-icon"><FaUsers /></span>
          Team Daily Reports
        </h2>
        <button onClick={refreshReports} className="refresh-button" disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="manager-layout">
        <aside className="manager-my-report-form">
          <h3 className="manager-form-title">My Daily Report</h3>
        <ReportForm
          today={today}
          reportText={reportText}
          isEditingToday={isEditingToday}
          errorMessage={errorMessage}
          loading={loadingToday}
          onTextChange={handleTextChange}
          onSubmit={handleReport}
          isModifying={!!existingReport && isEditingToday}
          compact
        />
        </aside>

        <main className="manager-team-reports">
          <h3 className="manager-section-title">Team Members&apos; Reports</h3>
          <div className="date-range-filter compact">
            <label>From</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
              className="date-input"
              disabled={loading}
            />
            <label>To</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
              className="date-input"
              disabled={loading}
            />
          </div>

          {loading ? (
            <div className="loading-message compact">Loading...</div>
          ) : error ? (
            <div className="error-message compact">
              {error}
              <button onClick={refreshReports} className="refresh-button">Retry</button>
            </div>
          ) : flatReports.length === 0 ? (
            <div className="no-reports compact">No team member reports in this period.</div>
          ) : (
            <div className="manager-reports-table-wrap">
          <table className="manager-reports-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Date</th>
                <th>Report</th>
                <th>Created</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {flatReports.map((r) => (
                <tr key={r.id}>
                  <td className="col-username">{r.userName}</td>
                  <td className="col-date">{r.date}</td>
                  <td className="col-report" title={r.text}>{r.text?.slice(0, 80)}{(r.text?.length || 0) > 80 ? '…' : ''}</td>
                  <td className="col-created">{formatDateTime(r.createdAt)}</td>
                  <td className="col-updated">{formatDateTime(r.updatedAt)}</td>
                  <td className="col-actions">
                    <button
                      className="delete-report-btn"
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting === r.id}
                      title="Delete report"
                    >
                      <FaTrash /> {deleting === r.id ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManagerDailyReportPage;

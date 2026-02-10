import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { useManagerDailyReports } from './hooks/useManagerDailyReports';
import { useDailyReport } from './hooks/useDailyReport';
import { getAccessToken, setUserId } from '../../store/auth/authStorage';
import { deleteDailyReports, submitDailyReport, updateDailyReport, fetchReportForDate, getServerDay, normalizeDate } from '../../store/reports/reportActions';
import { fetchUsers } from '../../store/users/userActions';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import { FaUsers, FaTrash, FaFilter, FaUser, FaSearchPlus } from 'react-icons/fa';
import './DailyReportPage.css';
import './ManagerDailyReportPage.css';

/** Build map: userId/userID -> full name for report labels */
function buildUserIdToName(users) {
  const map = {};
  (users || []).forEach((u) => {
    const name = u.name || u.userName || '';
    const id = u._id || u.id || u.uniqueID;
    const loginId = u.userID || u.userId || u.username;
    if (id) map[id] = name;
    if (loginId) map[loginId] = name;
  });
  return map;
}

const formatDateTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
};

const ManagerDailyReportPage = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({ startDate: '', endDate: '', date: '', filter_userUniqueID: '' });
  const [filterMode, setFilterMode] = useState('range'); // 'range' | 'single'

  useEffect(() => {
    getServerDay().then((serverToday) => {
      const [y, m, d] = serverToday.split('-').map(Number);
      const end = new Date(y, m - 1, d);
      const start = new Date(y, m - 1, d);
      start.setDate(start.getDate() - 30);
      const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
      setFilters((prev) => ({ ...prev, startDate: startStr, endDate: serverToday, date: serverToday }));
    });
  }, []);

  const apiFilters = filterMode === 'single'
    ? { startDate: filters.date, endDate: filters.date, filter_userUniqueID: filters.filter_userUniqueID || undefined }
    : {
        startDate: filters.startDate,
        endDate: filters.endDate,
        filter_userUniqueID: filters.filter_userUniqueID || undefined,
      };

  const { reports, loading, error, refreshReports } = useManagerDailyReports(apiFilters);
  const [userIdToName, setUserIdToName] = useState({});
  const [deleting, setDeleting] = useState(null);
  const [myReportCollapsed, setMyReportCollapsed] = useState(false);
  const [expandedReport, setExpandedReport] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchUsers()
      .then((data) => {
        if (!cancelled) setUserIdToName(buildUserIdToName(Array.isArray(data) ? data : []));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

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
    enableModify,
    addReport,
  } = useDailyReport({ alwaysEditable: true });

  const existingReport = myReports.find((r) => r.date === today);

  const flatReports = (Array.isArray(reports) ? reports : [])
    .filter((r) => r && (r._id || r.id))
    .map((r) => {
      const userId = typeof r.user === 'object' ? r.user?._id || r.user?.id || r.user?.uniqueID : (r.user || r.userId || r.user_id || r.id);
      const userName = (typeof r.user === 'object' && r.user?.userID) ||
        r.userName || r.user_name || r.name ||
        (typeof r.user === 'object' ? r.user?.name : null) ||
        (userId ? `User ${String(userId).slice(-8)}` : 'Unknown');
      const fullName = userIdToName[userId] ?? userIdToName[userName] ?? null;
      const reportDate = normalizeDate(r.date || r.reportDate);
      return { id: r._id || r.id, userId, userName, fullName, date: reportDate, text: r.main_content || r.content || r.text, createdAt: r.createdAt, updatedAt: r.updatedAt };
    })
    .sort((a, b) => (new Date(b.date) || 0) - (new Date(a.date) || 0));

  const uniqueUsers = [...new Map(flatReports.map((r) => [
    r.userId,
    { userId: r.userId, userName: r.userName, fullName: r.fullName }
  ])).values()];

  const handleReport = async () => {
    if (!today) return;
    if (!reportText.trim()) {
      alert("Please enter your report!");
      return;
    }
    let finalUserId = currentUserId;
    if (!finalUserId) {
      const token = getAccessToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          finalUserId = payload.id || payload.userId || payload.userID || payload.sub;
          if (finalUserId) setUserId(finalUserId);
        } catch (e) { /* ignore */ }
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
          if (/already|exist|one report|per day|only create one/i.test(errorMsg)) {
            sessionStorage.removeItem("lastReportError");
            const report = await dispatch(fetchReportForDate(today, finalUserId));
            const fetchedId = report?._id || report?.id;
            if (fetchedId) result = await dispatch(updateDailyReport(fetchedId, payload));
            if (result) {
              addReport(reportText, result._id || result.id, result.createdAt, result.updatedAt);
              await refreshReports();
              return;
            }
          }
        }
      }
      if (!result) {
        setErrorMessage(sessionStorage.getItem("lastReportError") || "Failed to submit report.");
        return;
      }
      addReport(reportText, result._id || result.id, result.createdAt, result.updatedAt);
      await refreshReports();
    } catch (e) {
      alert(e.message || "Failed to submit report.");
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Delete this report?')) return;
    setDeleting(reportId);
    try {
      const result = await dispatch(deleteDailyReports([reportId]));
      if (result?.ok) await refreshReports();
      else alert(result?.message || 'Failed to delete.');
    } catch (e) {
      alert('Failed to delete.');
    } finally {
      setDeleting(null);
    }
  };

  const selectUser = (userId) => {
    setFilters((prev) => ({ ...prev, filter_userUniqueID: userId || '' }));
  };

  return (
    <div className="daily-report manager-daily-report">
      <div className="manager-bar">
        <h2 className="manager-title"><FaUsers /> Team Reports</h2>
        <button onClick={refreshReports} className="refresh-button" disabled={loading}>Refresh</button>
      </div>

      <div className="manager-filters">
        <div className="filter-row">
          <span className="filter-label"><FaFilter /> Filter</span>
          <button
            className={`filter-mode-btn ${filterMode === 'range' ? 'active' : ''}`}
            onClick={() => setFilterMode('range')}
          >
            Range
          </button>
          <button
            className={`filter-mode-btn ${filterMode === 'single' ? 'active' : ''}`}
            onClick={() => setFilterMode('single')}
          >
            Date
          </button>
          {filterMode === 'range' ? (
            <>
              <input type="date" value={filters.startDate} onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))} className="filter-input" />
              <span className="filter-sep">→</span>
              <input type="date" value={filters.endDate} onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))} className="filter-input" />
            </>
          ) : (
            <input type="date" value={filters.date} onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))} className="filter-input" />
          )}
        </div>
        <div className="user-chips">
          <span className="filter-label"><FaUser /> User</span>
          <button
            className={`user-chip ${!filters.filter_userUniqueID ? 'active' : ''}`}
            onClick={() => selectUser('')}
          >
            All
          </button>
          {uniqueUsers.map((u) => (
            <button
              key={u.userId}
              className={`user-chip ${filters.filter_userUniqueID === u.userId ? 'active' : ''}`}
              onClick={() => selectUser(u.userId)}
            >
              {u.fullName || u.userName}
            </button>
          ))}
        </div>
      </div>

      <div className="manager-layout">
        <aside className="manager-my-report-form">
          <button className="collapse-toggle" onClick={() => setMyReportCollapsed(!myReportCollapsed)}>
            My Report {myReportCollapsed ? '▼' : '▲'}
          </button>
          {!myReportCollapsed && (
            <>
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
              <h4 className="manager-my-reports-title">My Reports</h4>
              <ReportList reports={myReports} today={today} onModify={enableModify} showTimestamps />
            </>
          )}
        </aside>

        <main className="manager-team-reports">
          {loading ? (
            <div className="loading-msg">Loading…</div>
          ) : error ? (
            <div className="error-msg">{error} <button onClick={refreshReports}>Retry</button></div>
          ) : flatReports.length === 0 ? (
            <div className="no-reports-msg">No reports in this period.</div>
          ) : (
            <div className="manager-reports-grid">
              {flatReports.map((r) => (
                <div
                  key={r.id}
                  className="report-card"
                  onClick={() => setExpandedReport(r)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setExpandedReport(r)}
                  title="Click to view full report"
                >
                  <div className="report-card-header">
                    <span className="report-card-user">{r.fullName || r.userName}</span>
                    <span className="report-card-date">{r.date}</span>
                    <button
                      className="report-card-delete"
                      onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
                      disabled={deleting === r.id}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {(r.createdAt || r.updatedAt) && (
                    <div className="report-card-meta">
                      {r.createdAt && <span>Created: {formatDateTime(r.createdAt)}</span>}
                      {r.updatedAt && r.createdAt && new Date(r.updatedAt).getTime() !== new Date(r.createdAt).getTime() && (
                        <span>Updated: {formatDateTime(r.updatedAt)}</span>
                      )}
                    </div>
                  )}
                  <p className="report-card-text">{r.text}</p>
                  <div className="report-card-expand-hint">
                    <FaSearchPlus /> View full report
                  </div>
                </div>
              ))}
            </div>
          )}

      {expandedReport && createPortal(
        <div className="modal-overlay report-expand-modal-overlay" onClick={() => setExpandedReport(null)}>
          <div className="report-expand-modal" onClick={e => e.stopPropagation()}>
            <div className="report-expand-header">
              <h3>{expandedReport.fullName || expandedReport.userName}</h3>
              <span className="report-expand-date">{expandedReport.date}</span>
              <button className="report-expand-close" onClick={() => setExpandedReport(null)}>×</button>
            </div>
            {(expandedReport.createdAt || expandedReport.updatedAt) && (
              <div className="report-expand-meta">
                {expandedReport.createdAt && <span>Created: {formatDateTime(expandedReport.createdAt)}</span>}
                {expandedReport.updatedAt && expandedReport.createdAt && new Date(expandedReport.updatedAt).getTime() !== new Date(expandedReport.createdAt).getTime() && (
                  <span>Updated: {formatDateTime(expandedReport.updatedAt)}</span>
                )}
              </div>
            )}
            <div className="report-expand-text">{expandedReport.text}</div>
          </div>
        </div>,
        document.body
      )}
        </main>
      </div>
    </div>
  );
};

export default ManagerDailyReportPage;

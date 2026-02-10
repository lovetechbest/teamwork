import api from "../../api";
import { getAccessToken } from "../auth/authStorage";
import { fetchUsers } from "../users/userActions";

/**
 * Fetch server's current day (YYYY-MM-DD). Use for "today" - matches server.
 */
export const getServerDay = async () => {
  try {
    const res = await api.get("/env/get-server-day");
    const data = res?.data;
    const day = data?.today || data?.day || data?.date;
    if (day && typeof day === "string") {
      const normalized = day.includes("T") ? day.split("T")[0] : day;
      return normalized;
    }
    return new Date().toISOString().split("T")[0];
  } catch (err) {
    return new Date().toISOString().split("T")[0];
  }
};

/** Fallback: Pacific time when server unavailable */
export const getPacificDay = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
};

// Backend expects date as YYYY-M-D (no leading zeros)
const toApiDate = (isoDate) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${y}-${m}-${d}`;
};

/**
 * Normalize date to YYYY-MM-DD. Use date part when server sends midnight UTC
 * (2026-02-07T00:00:00.000Z = calendar day 02-07), else format in Pacific.
 */
export const normalizeDate = (d) => {
  if (!d) return null;
  const s = String(d).trim();
  const dateMatch = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    const datePart = dateMatch[1];
    if (s === datePart || /T00:00(\.0+)?Z?$/.test(s)) return datePart;
  }
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return null;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(parsed);
};

export const REPORT_SUBMIT_START = "REPORT_SUBMIT_START";
export const REPORT_SUBMIT_SUCCESS = "REPORT_SUBMIT_SUCCESS";
export const REPORT_SUBMIT_FAIL = "REPORT_SUBMIT_FAIL";
export const FETCH_ALL_REPORTS_START = "FETCH_ALL_REPORTS_START";
export const FETCH_ALL_REPORTS_SUCCESS = "FETCH_ALL_REPORTS_SUCCESS";
export const FETCH_ALL_REPORTS_FAIL = "FETCH_ALL_REPORTS_FAIL";

export const submitDailyReport = (payload) => async (dispatch) => {
  dispatch({ type: REPORT_SUBMIT_START });

  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      const errorMsg = "No authentication token found. Please login first.";
      dispatch({
        type: REPORT_SUBMIT_FAIL,
        payload: errorMsg,
      });
      return null;
    }

    if (!payload.id) {
      const errorMsg = "User ID is missing. Please login again.";
      dispatch({
        type: REPORT_SUBMIT_FAIL,
        payload: errorMsg,
      });
      return null;
    }

    const res = await api.post("/dayreports/create", payload);

    dispatch({
      type: REPORT_SUBMIT_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    let message = "Failed to submit report";
    
    if (err.response) {
      message = err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`;
      
      
      // Store error message for potential retry logic
      sessionStorage.setItem("lastReportError", message);
      
      // Don't show alert for "already exists" errors - let component handle retry
      const lowerMsg = message.toLowerCase();
      if (!lowerMsg.includes("already") && 
          !lowerMsg.includes("exist") && 
          !lowerMsg.includes("one report") &&
          !lowerMsg.includes("per day")) {
        alert(message);
      }
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
      sessionStorage.setItem("lastReportError", message);
      alert(message);
    } else {
      message = err.message || "Failed to submit report";
      sessionStorage.setItem("lastReportError", message);
      alert(message);
    }

    dispatch({
      type: REPORT_SUBMIT_FAIL,
      payload: message,
    });

    return null;
  }
};

export const updateDailyReport = (reportId, payload) => async (dispatch) => {
  dispatch({ type: REPORT_SUBMIT_START });

  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      const errorMsg = "No authentication token found. Please login first.";
      dispatch({
        type: REPORT_SUBMIT_FAIL,
        payload: errorMsg,
      });
      return null;
    }

    if (!reportId) {
      const errorMsg = "Report ID is missing. Cannot update report.";
      dispatch({
        type: REPORT_SUBMIT_FAIL,
        payload: errorMsg,
      });
      return null;
    }

    const res = await api.put(`/dayreports/update/${reportId}`, {
      main_content: payload.main_content,
    });

    dispatch({
      type: REPORT_SUBMIT_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    let message = "Failed to update report";
    
    if (err.response) {
      message = err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`;
      
      sessionStorage.setItem("lastReportError", message);
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
      sessionStorage.setItem("lastReportError", message);
    } else {
      message = err.message || "Failed to update report";
      sessionStorage.setItem("lastReportError", message);
    }
    
    // Don't show alert for update errors - let the component handle it
    // alert(message);

    dispatch({
      type: REPORT_SUBMIT_FAIL,
      payload: message,
    });

    return null;
  }
};

export const deleteDailyReports = (reportIds) => async (dispatch) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) return { ok: false, message: "Not authenticated" };

    const idsParam = Array.isArray(reportIds) ? reportIds.join(",") : reportIds;
    await api.delete("/dayreports/delete", { params: { reportIDs: idsParam } });
    return { ok: true };
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to delete";
    return { ok: false, message: msg };
  }
};

export const fetchReportForDate = (date, forUserId = null) => async () => {
  try {
    const apiDate = toApiDate(date);
    const params = { startDate: apiDate, endDate: apiDate };
    if (forUserId) {
      params.filter_userUniqueID = forUserId;
    }
    const res = await api.get("/dayreports/getReports", { params });
    const list = Array.isArray(res.data) ? res.data : res.data?.reports || (Array.isArray(res.data?.data) ? res.data.data : []);
    const matchesDate = (r) => normalizeDate(r.date || r.reportDate) === date;
    const getReportUserId = (r) => {
      if (typeof r.user === "object") return r.user?._id || r.user?.id || r.user?.uniqueID;
      return r.user || r.userId || r.user_id;
    };
    const matchesUser = (r) => {
      if (!forUserId) return true;
      const uid = getReportUserId(r);
      return uid && String(uid) === String(forUserId);
    };
    return list.find((r) => matchesDate(r) && matchesUser(r)) || null;
  } catch (err) {
    return null;
  }
};

/**
 * Fetch report history for a user (for populating list after login)
 * @param {string} forUserId - User ID to filter by
 * @param {number} daysBack - Number of days to look back
 * @param {string} [serverToday] - Optional server's "today" (YYYY-MM-DD) for consistent date range
 */
export const fetchReportHistory = async (forUserId, daysBack = 90, serverToday = null) => {
  try {
    const endDateStr = serverToday || (await getServerDay());
    const end = new Date(endDateStr);
    const start = new Date(end);
    start.setDate(start.getDate() - daysBack);
    const params = {
      startDate: toApiDate(start.toISOString().split("T")[0]),
      endDate: toApiDate(endDateStr),
    };
    if (forUserId) {
      params.filter_userUniqueID = forUserId;
    }
    const res = await api.get("/dayreports/getReports", { params });
    const list = Array.isArray(res.data) ? res.data : res.data?.reports || (Array.isArray(res.data?.data) ? res.data.data : []);
    const getReportUserId = (r) => {
      if (typeof r.user === "object") return r.user?._id || r.user?.id || r.user?.uniqueID;
      return r.user || r.userId || r.user_id;
    };
    const matchesUser = (r) => {
      if (!forUserId) return true;
      const uid = getReportUserId(r);
      return uid && String(uid) === String(forUserId);
    };
    return list
      .filter((r) => matchesUser(r))
      .map((r) => ({
        id: Date.now() + Math.random(),
        reportId: r._id || r.id,
        date: normalizeDate(r.date || r.reportDate),
        text: r.main_content || r.content || r.text,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }))
      .filter((r) => r.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    return [];
  }
};

/**
 * Fetch reported/not-reported counts for a given date. For highman dashboard.
 * Uses getReports response: if backend returns { users: [...] }, each user has reports[].
 * Otherwise falls back to: totalUsers from fetchUsers, reportedCount from unique reporters.
 */
export const fetchDailyReportStats = async (date) => {
  const accessToken = getAccessToken();
  if (!accessToken) return { reportedCount: 0, notReportedCount: 0 };

  const apiDate = toApiDate(date);
  let data;
  let reportedCount = 0;

  try {
    const res = await api.get("/dayreports/getReports", {
      params: { startDate: apiDate, endDate: apiDate },
    });
    data = res?.data;
  } catch (err) {
    const status = err?.response?.status;
    if (status === 403) {
      throw new Error("Access denied (403) on getReports. Backend may restrict Team Leader.");
    }
    throw err;
  }

  // Backend returns { users: [{ userId, userName, reports: [...] }] } - all team members
  if (data?.users && Array.isArray(data.users)) {
    const totalUsers = data.users.length;
    reportedCount = data.users.filter(
      (u) => (u.reports || []).length > 0
    ).length;
    const notReportedCount = totalUsers - reportedCount;
    return { reportedCount, notReportedCount };
  }

  // Fallback: reports array only - we have reported count, need total from users API
  const reports = Array.isArray(data)
    ? data
    : data?.reports || data?.data || [];
  const getReportUserId = (r) => {
    if (typeof r.user === "object") return r.user?._id || r.user?.id || r.user?.uniqueID;
    return r.user || r.userId || r.user_id;
  };
  const uniqueReporters = new Set(
    reports.map(getReportUserId).filter(Boolean)
  );
  reportedCount = uniqueReporters.size;

  try {
    const users = await fetchUsers();
    const totalUsers = users.length;
    const notReportedCount = Math.max(0, totalUsers - reportedCount);
    return { reportedCount, notReportedCount };
  } catch (err) {
    throw new Error(
      err?.message || "Report stats need get-users. Backend may restrict Team Leader."
    );
  }
};

export const fetchAllDailyReports = (params = {}) => async (dispatch) => {
  dispatch({ type: FETCH_ALL_REPORTS_START });

  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      const errorMsg = "No authentication token found. Please login first.";
      dispatch({
        type: FETCH_ALL_REPORTS_FAIL,
        payload: errorMsg,
      });
      return null;
    }

    // Map frontend params to backend API params (YYYY-M-D format)
    const apiParams = {};
    if (params.startDate) apiParams.startDate = toApiDate(params.startDate);
    if (params.endDate) apiParams.endDate = toApiDate(params.endDate);
    if (params.date) apiParams.date = toApiDate(params.date);
    if (params.filter_userUniqueID) apiParams.filter_userUniqueID = params.filter_userUniqueID;

    const res = await api.get("/dayreports/getReports", { params: apiParams });
    const data = res.data;

    dispatch({
      type: FETCH_ALL_REPORTS_SUCCESS,
      payload: data,
    });

    // Backend may return: array, { reports: [] }, { data: [] }, or { users: [{ reports: [] }] }
    if (Array.isArray(data)) return data;
    if (data?.reports && Array.isArray(data.reports)) return data.reports;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.users && Array.isArray(data.users)) {
      return data.users.flatMap((u) =>
        (u.reports || []).map((r) => ({
          ...r,
          userId: u.userId || u.id || r.user,
          userName: u.userName || u.name || r.userName,
        }))
      );
    }
    return [];
  } catch (err) {
    let message = "Failed to fetch reports";
    
    if (err.response) {
      // 404 may mean no reports in range - treat as empty
      if (err.response.status === 404) {
        dispatch({ type: FETCH_ALL_REPORTS_SUCCESS, payload: [] });
        return [];
      }
      message = err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`;
      
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
    } else {
      message = err.message || "Failed to fetch reports";
    }

    dispatch({
      type: FETCH_ALL_REPORTS_FAIL,
      payload: message,
    });

    return null;
  }
};

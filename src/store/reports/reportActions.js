import api from "../../api";

// Backend expects date as YYYY-M-D (no leading zeros)
const toApiDate = (isoDate) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${y}-${m}-${d}`;
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
    const accessToken = sessionStorage.getItem("accessToken");
    
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
      
      console.error("Report submit error:", {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers,
      });
      
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
      console.error("Network error:", err.request);
      sessionStorage.setItem("lastReportError", message);
      alert(message);
    } else {
      message = err.message || "Failed to submit report";
      console.error("Error:", err.message);
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
    const accessToken = sessionStorage.getItem("accessToken");
    
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
      
      console.error("Report update error:", {
        status: err.response.status,
        data: err.response.data,
      });
      sessionStorage.setItem("lastReportError", message);
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
      console.error("Network error:", err.request);
      sessionStorage.setItem("lastReportError", message);
    } else {
      message = err.message || "Failed to update report";
      console.error("Error:", err.message);
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
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) return { ok: false, message: "Not authenticated" };

    const idsParam = Array.isArray(reportIds) ? reportIds.join(",") : reportIds;
    await api.delete("/dayreports/delete", { params: { reportIDs: idsParam } });
    return { ok: true };
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to delete";
    console.error("Delete reports error:", err);
    return { ok: false, message: msg };
  }
};

export const fetchReportForDate = (date, forUserId = null) => async () => {
  try {
    const apiDate = toApiDate(date);
    const res = await api.get("/dayreports/getReports", {
      params: { startDate: apiDate, endDate: apiDate },
    });
    const list = Array.isArray(res.data) ? res.data : res.data?.reports || [];
    const normalizeDate = (d) =>
      d ? new Date(d).toISOString().split("T")[0] : null;
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
    console.error("Fetch report for date error:", err);
    return null;
  }
};

export const fetchAllDailyReports = (params = {}) => async (dispatch) => {
  dispatch({ type: FETCH_ALL_REPORTS_START });

  try {
    const accessToken = sessionStorage.getItem("accessToken");
    
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
    if (params.startDate) {
      apiParams.startDate = toApiDate(params.startDate);
    }
    if (params.endDate) {
      apiParams.endDate = toApiDate(params.endDate);
    }

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
      
      console.error("Fetch reports error:", {
        status: err.response.status,
        data: err.response.data,
        url: "/dayreports/getReports",
        params: apiParams,
      });
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
      console.error("Network error:", err.request);
    } else {
      message = err.message || "Failed to fetch reports";
      console.error("Error:", err.message);
    }

    dispatch({
      type: FETCH_ALL_REPORTS_FAIL,
      payload: message,
    });

    return null;
  }
};

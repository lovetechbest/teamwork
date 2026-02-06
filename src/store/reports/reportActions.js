import api from "../../api";

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
      
      alert(message);
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
      console.error("Network error:", err.request);
      alert(message);
    } else {
      message = err.message || "Failed to submit report";
      console.error("Error:", err.message);
      alert(message);
    }

    dispatch({
      type: REPORT_SUBMIT_FAIL,
      payload: message,
    });

    return null;
  }
};

export const fetchAllDailyReports = () => async (dispatch) => {
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

    const res = await api.get("/dayreports/all");

    dispatch({
      type: FETCH_ALL_REPORTS_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    let message = "Failed to fetch reports";
    
    if (err.response) {
      message = err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`;
      
      console.error("Fetch reports error:", {
        status: err.response.status,
        data: err.response.data,
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

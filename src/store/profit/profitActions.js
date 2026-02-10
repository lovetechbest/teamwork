import api from "../../api";
import { getAccessToken } from "../../utils/tokenManager";

export const FETCH_ALL_PROFITS_START = "FETCH_ALL_PROFITS_START";
export const FETCH_ALL_PROFITS_SUCCESS = "FETCH_ALL_PROFITS_SUCCESS";
export const FETCH_ALL_PROFITS_FAIL = "FETCH_ALL_PROFITS_FAIL";

export const fetchAllProfits = (params = {}) => async (dispatch) => {
  dispatch({ type: FETCH_ALL_PROFITS_START });

  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      const errorMsg = "No authentication token found. Please login first.";
      dispatch({
        type: FETCH_ALL_PROFITS_FAIL,
        payload: errorMsg,
      });
      return null;
    }

    const res = await api.get("/profits/all", { params });

    dispatch({
      type: FETCH_ALL_PROFITS_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    let message = "Failed to fetch profits";
    
    if (err.response) {
      message = err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`;
      
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
    } else {
      message = err.message || "Failed to fetch profits";
    }

    dispatch({
      type: FETCH_ALL_PROFITS_FAIL,
      payload: message,
    });

    return null;
  }
};

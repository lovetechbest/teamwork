import api from "../../api";

export const login = (username, password) => async (dispatch) => {
  dispatch({ type: "LOGIN_REQUEST" });

  try {
    const res = await api.post("/auth/login", {
      userID: username,
      password: password,
    });

    if (res.data && res.data.accessToken) {
      sessionStorage.setItem("accessToken", res.data.accessToken);
      
      console.log("Login response:", res.data);
      
      let userId = res.data.user?.id || 
                   res.data.userId || 
                   res.data.id || 
                   res.data.user?.userID ||
                   res.data.userID;
      
      let userRole = res.data.user?.role || 
                     res.data.role ||
                     res.data.user?.userRole;
      
      if (!userId && res.data.accessToken) {
        try {
          const tokenParts = res.data.accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            userId = payload.id || payload.userId || payload.userID || payload.sub;
            userRole = userRole || payload.role || payload.userRole;
            console.log("Extracted userId from token:", userId);
            console.log("Extracted role from token:", userRole);
          }
        } catch (e) {
          console.warn("Could not decode token:", e);
        }
      }
      
      if (userId) {
        sessionStorage.setItem("userId", userId);
        console.log("Stored userId:", userId);
      } else {
        console.warn("User ID not found in login response. Response structure:", res.data);
      }
      
      if (userRole) {
        sessionStorage.setItem("userRole", userRole);
        console.log("Stored userRole:", userRole);
      }
      
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { ...res.data, userId, role: userRole },
      });

      return res.data;
    } else {
      throw new Error("No access token received from server");
    }
  } catch (err) {
    let message = "Login failed";
    
    if (err.response) {
      message = err.response.data?.message || err.response.data?.error || `Server error: ${err.response.status}`;
      console.error("Login error:", {
        status: err.response.status,
        data: err.response.data,
      });
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
      console.error("Network error:", err.request);
    } else {
      message = err.message || "Login failed";
      console.error("Error:", err.message);
    }
    
    dispatch({ type: "LOGIN_FAIL", payload: message });
    throw new Error(message);
  }
};

export const signUp = ({ name, username, password, confirmPassword, role }) => async (dispatch) => {
  dispatch({ type: "SIGNUP_REQUEST" });

  try {
    const res = await api.post("/auth/register", {
      name,
      userID: username,
      password,
      confirmPassword,
      role,
    });

    console.log("Backend success reply:", res.data);

    if (role) {
      sessionStorage.setItem("userRole", role);
    }

    dispatch({
      type: "SIGNUP_SUCCESS",
      payload: { ...res.data, role },
    });

    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || "Signup failed";
    console.error("Backend error reply:", err.response?.data);
    dispatch({ type: "SIGNUP_FAIL", payload: message });
    throw new Error(message);
  }
};

export const logout = () => ({ type: "LOGOUT" });

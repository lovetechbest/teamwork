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
      
      let userId = res.data.user?.uniqueID || 
                   res.data.user?._id || 
                   res.data.user?.id || 
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
          }
        } catch (e) {
          // Could not decode token
        }
      }
      
      if (userId) {
        sessionStorage.setItem("userId", userId);
      }
      
      if (userRole) {
        sessionStorage.setItem("userRole", userRole);
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
    } else if (err.request) {
      message = "Network error: Could not reach the server. Please check your connection.";
    } else {
      message = err.message || "Login failed";
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
    dispatch({ type: "SIGNUP_FAIL", payload: message });
    throw new Error(message);
  }
};

export const changeUserInfo = ({ id, name, userID, password, role }) => async (dispatch) => {
  dispatch({ type: "CHANGE_USERINFO_REQUEST" });

  try {
    const userId = id || sessionStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found. Please login again.");

    const body = {};
    if (name != null) body.name = name;
    if (userID != null) body.userID = userID;
    if (password) body.password = password;
    if (role != null) body.role = role;

    const res = await api.put(`/users/update/${userId}`, body);

    if (res.data?.user) {
      const updatedUser = res.data.user;
      const newUserId = updatedUser.uniqueID || updatedUser._id || updatedUser.id || userId;
      const newRole = updatedUser.role || res.data.role;
      if (newUserId) sessionStorage.setItem("userId", newUserId);
      if (newRole) sessionStorage.setItem("userRole", newRole);
      dispatch({ type: "LOGIN_SUCCESS", payload: { ...res.data, userId: newUserId, role: newRole } });
    }

    return res.data;
  } catch (err) {
    const data = err.response?.data;
    const message =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : null) ||
      err.message ||
      "Failed to update user info";
    dispatch({ type: "CHANGE_USERINFO_FAIL", payload: message });
    throw new Error(message);
  }
};

export const logout = () => async (dispatch) => {
  try {
    // Send logout request to server
    await api.get("/auth/logout");
  } catch (err) {
    // Even if logout request fails, continue with local logout
  } finally {
    // Always dispatch logout action and clear local storage
    dispatch({ type: "LOGOUT" });
  }
};

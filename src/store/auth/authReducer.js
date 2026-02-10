const getInitialState = () => {
  // Don't check localStorage for accessToken - will refresh on app load
  // Only restore userId/role from localStorage for display purposes
  try {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");
    return {
      isLoggedIn: false, // Will be set to true after refresh check
      user: userId ? { id: userId, role: userRole } : null,
      userId: userId,
      role: userRole,
      token: null, // Will be set after refresh
      error: null,
      loading: true // Start loading to check refresh token
    };
  } catch (error) {
    return {
      isLoggedIn: false,
      user: null,
      userId: null,
      role: null,
      token: null,
      error: null,
      loading: true
    };
  }
};

const initialState = getInitialState();

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'SIGNUP_REQUEST':
    case 'CHANGE_USERINFO_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'LOGIN_SUCCESS':
      const userId = action.payload.userId || 
                     action.payload.user?.id || 
                     action.payload.id ||
                     action.payload.user?._id ||
                     action.payload.user?.userID ||
                     action.payload.userID;
      
      const userRole = action.payload.role ||
                       action.payload.user?.role ||
                       action.payload.userRole;
      
      if (userId) {
        localStorage.setItem("userId", userId);
      }
      
      if (userRole) {
        localStorage.setItem("userRole", userRole);
      }
      
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        user: action.payload.user || (userId ? { id: userId, role: userRole } : null),
        userId: userId,
        role: userRole,
        token: action.payload.token || action.payload.accessToken
      };

    case 'RESTORE_SESSION':
      const restoredUserId = action.payload.userId || localStorage.getItem("userId");
      const restoredRole = action.payload.role || localStorage.getItem("userRole");
      if (restoredUserId) localStorage.setItem("userId", restoredUserId);
      if (restoredRole) localStorage.setItem("userRole", restoredRole);
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        token: action.payload.token,
        userId: restoredUserId,
        role: restoredRole,
        user: restoredUserId ? { id: restoredUserId, role: restoredRole } : null
      };

    case 'SIGNUP_SUCCESS':
      const signupRole = action.payload.role;
      if (signupRole) {
        localStorage.setItem("userRole", signupRole);
      }
      return {
        ...state,
        loading: false,
        role: signupRole
      };

    case 'LOGIN_FAIL':
    case 'SIGNUP_FAIL':
    case 'CHANGE_USERINFO_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'LOGOUT':
      // Don't remove accessToken from localStorage (it's not stored there)
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      Object.keys(localStorage)
        .filter(k => k.startsWith('dailyReports'))
        .forEach(k => localStorage.removeItem(k));
      return {
        isLoggedIn: false,
        user: null,
        userId: null,
        role: null,
        token: null,
        error: null,
        loading: false
      };

    default:
      return state;
  }
}

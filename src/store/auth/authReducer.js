import { getAccessToken, getUserId, getUserRole, setUserId, setUserRole, clearAuth } from "./authStorage";

const getInitialState = () => {
  try {
    const accessToken = getAccessToken();
    const userId = getUserId();
    const userRole = getUserRole();
    return {
      isLoggedIn: !!accessToken,
      user: userId ? { id: userId, role: userRole } : null,
      userId: userId,
      role: userRole,
      token: accessToken,
      error: null,
      loading: false
    };
  } catch (error) {
    return {
      isLoggedIn: false,
      user: null,
      userId: null,
      role: null,
      token: null,
      error: null,
      loading: false
    };
  }
};

export default function authReducer(state, action) {
  if (state === undefined) {
    state = getInitialState();
  }
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
                     action.payload.user?.userID ||
                     action.payload.userID;
      
      const userRole = action.payload.role ||
                       action.payload.user?.role ||
                       action.payload.userRole;
      
      if (userId) setUserId(userId);
      if (userRole) setUserRole(userRole);

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
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token
      };

    case 'SIGNUP_SUCCESS': {
      const signupRole = action.payload.role;
      if (signupRole) setUserRole(signupRole);
      return {
        ...state,
        loading: false,
        role: signupRole
      };
    }

    case 'LOGIN_FAIL':
    case 'SIGNUP_FAIL':
    case 'CHANGE_USERINFO_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'LOGOUT':
      clearAuth();
      try {
        Object.keys(localStorage)
          .filter(k => k.startsWith('dailyReports'))
          .forEach(k => localStorage.removeItem(k));
      } catch (_) {}
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

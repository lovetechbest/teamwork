const getInitialState = () => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");
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

const initialState = getInitialState();

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'SIGNUP_REQUEST':
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
      
      if (userId) {
        sessionStorage.setItem("userId", userId);
        console.log("Reducer: Stored userId:", userId);
      } else {
        console.warn("Reducer: User ID not found in payload:", action.payload);
      }
      
      if (userRole) {
        sessionStorage.setItem("userRole", userRole);
        console.log("Reducer: Stored role:", userRole);
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
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token
      };

    case 'SIGNUP_SUCCESS':
      const signupRole = action.payload.role;
      if (signupRole) {
        sessionStorage.setItem("userRole", signupRole);
      }
      return {
        ...state,
        loading: false,
        role: signupRole
      };

    case 'LOGIN_FAIL':
    case 'SIGNUP_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'LOGOUT':
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("userRole");
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

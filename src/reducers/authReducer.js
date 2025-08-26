import { AUTH_SUCCESS, AUTH_ERROR, LOGOUT, CLEAR_ERROR, SET_LOADING } from '../constants/authConstants';

// Initial state
export const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Reducer function
export const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case AUTH_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        token: null,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        token: null,
        error: null
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

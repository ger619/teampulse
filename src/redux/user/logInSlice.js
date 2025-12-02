import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  success: false,
  error: null,
  token: null,
  user: null, // Add user object
  isLoggedIn: false,
};

const logInSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logInRequest: (state) => {
      state.loading = true;
      state.error = false;
    },
    logInSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.token = action.payload.token;
      state.user = action.payload.user; // Store user data
      state.isLoggedIn = true;
    },
    logInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
    },
    logOut: (state) => {
      state.success = false;
      state.isLoggedIn = false;
      state.token = null;
      state.user = null; // Clear user data
    },
    // Add action to load user from localStorage on app start
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('authToken');
      const userString = localStorage.getItem('pulse_current_user');
      
      if (token && userString) {
        state.token = token;
        state.user = JSON.parse(userString);
        state.isLoggedIn = true;
      }
    },
  },
});

export const {
  logInRequest, 
  logInSuccess, 
  logInFailure, 
  logOut,
  loadUserFromStorage,
} = logInSlice.actions;

export default logInSlice.reducer;
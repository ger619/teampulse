import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../../api/authService';
import { getCurrentUser } from '../../api/userService';
import { tokenManager } from '../../utils/tokenManager';

// Async thunk for login
export const login = createAsyncThunk(
  'login/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const authResponse = await loginUser(credentials);
      const { access } = authResponse;
      
      // Store access token in memory only (secure)
      if (access) {
        tokenManager.setAccessToken(access);
      }
      
      // NOTE: refresh token should be set as HTTP-only cookie by backend
      // We do NOT store it in localStorage or anywhere accessible to JavaScript
      
      // Fetch user data
      const userData = await getCurrentUser();
      // Store user data in localStorage (non-sensitive, for persistence)
      localStorage.setItem('pulse_current_user', JSON.stringify(userData));
      
      return { user: userData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  loading: false,
  success: false,
  error: null,
  user: null,
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
      state.user = action.payload.user;
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
      state.user = null;
      // Clear tokens from memory
      tokenManager.clearTokens();
    },
    // Load user from storage and check if we can refresh token
    loadUserFromStorage: (state) => {
      const userString = localStorage.getItem('pulse_current_user');
      
      if (userString) {
        state.user = JSON.parse(userString);
        // Try to get/refresh token from HTTP-only cookie
        // The actual token check happens when API calls are made
        state.isLoggedIn = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
      });
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
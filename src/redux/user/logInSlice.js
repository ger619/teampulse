import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../../api/authService';
import { getCurrentUser } from '../../api/userService';

// Async thunk for login
export const login = createAsyncThunk(
  'login/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const authResponse = await loginUser(credentials);
      const { access, refresh } = authResponse;
      
      // Store tokens
      localStorage.setItem('authToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Fetch user data
      const userData = await getCurrentUser();
      localStorage.setItem('pulse_current_user', JSON.stringify(userData));
      
      return { token: access, refresh, user: userData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token;
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
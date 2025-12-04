import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser } from '../../api/authService';
import { tokenManager } from '../../utils/tokenManager';

// Async thunk for signup
export const signup = createAsyncThunk(
  'signup/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      const { access } = response;
      
      // Store access token in memory only (secure)
      if (access) {
        tokenManager.setAccessToken(access);
      }
      
      // NOTE: refresh token should be set as HTTP-only cookie by backend
      // We do NOT store it in localStorage or anywhere accessible to JavaScript
      
      return { user: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const signUpSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    signUpRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    signUpSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    signUpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setToken: () => {
      // Token is now managed by tokenManager, this action is deprecated
      console.warn('setToken is deprecated - tokens are managed securely in memory');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  signUpRequest, signUpSuccess, signUpFailure, setToken,
} = signUpSlice.actions;

export default signUpSlice.reducer;
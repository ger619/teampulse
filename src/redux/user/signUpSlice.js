import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser } from '../../api/authService';

// Async thunk for signup
export const signup = createAsyncThunk(
  'signup/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      const { access, refresh } = response;
      
      // Store tokens
      localStorage.setItem('authToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      return { token: access, refresh, user: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  token: null, // Add token to initial state
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
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token;
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
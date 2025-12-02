import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for creating a pulse log
export const createPulseLog = createAsyncThunk(
  'pulseLogs/createPulseLog',
  async (pulseLogData, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('/api/pulse-logs/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pulseLogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create pulse log');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  loading: false,
  success: false,
  error: null,
  currentLog: null,
};

const pulseLogSlice = createSlice({
  name: 'pulseLogs',
  initialState,
  reducers: {
    clearPulseLogState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.currentLog = null;
    },
    resetPulseLogSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPulseLog.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPulseLog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentLog = action.payload;
        state.error = null;
      })
      .addCase(createPulseLog.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearPulseLogState, resetPulseLogSuccess } = pulseLogSlice.actions;
export default pulseLogSlice.reducer;
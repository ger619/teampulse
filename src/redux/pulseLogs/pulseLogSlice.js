import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createPulseLog as createPulseLogAPI, getPulseLogs } from '../../api/pulseLogService';

// Async thunk for creating a pulse log
export const createPulseLog = createAsyncThunk(
  'pulseLogs/createPulseLog',
  async (pulseLogData, { rejectWithValue }) => {
    try {
      return await createPulseLogAPI(pulseLogData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching pulse logs
export const fetchPulseLogs = createAsyncThunk(
  'pulseLogs/fetchPulseLogs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await getPulseLogs(filters);
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
  logs: [],
  totalCount: 0,
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
      })
      .addCase(fetchPulseLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPulseLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.results || [];
        state.totalCount = action.payload.count || 0;
        state.error = null;
      })
      .addCase(fetchPulseLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPulseLogState, resetPulseLogSuccess } = pulseLogSlice.actions;
export default pulseLogSlice.reducer;
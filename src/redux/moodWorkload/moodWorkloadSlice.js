import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMoods, getWorkloads } from '../../api/moodWorkloadService';

// Async thunk for fetching moods
export const fetchMoods = createAsyncThunk(
  'moodWorkload/fetchMoods',
  async (_, { rejectWithValue }) => {
    try {
      return await getMoods();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching workloads
export const fetchWorkloads = createAsyncThunk(
  'moodWorkload/fetchWorkloads',
  async (_, { rejectWithValue }) => {
    try {
      return await getWorkloads();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  moods: [],
  workloads: [],
};

const moodWorkloadSlice = createSlice({
  name: 'moodWorkload',
  initialState,
  reducers: {
    clearMoodWorkloadState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoods.fulfilled, (state, action) => {
        state.loading = false;
        state.moods = action.payload.results || action.payload || [];
        state.error = null;
      })
      .addCase(fetchMoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWorkloads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkloads.fulfilled, (state, action) => {
        state.loading = false;
        state.workloads = action.payload.results || action.payload || [];
        state.error = null;
      })
      .addCase(fetchWorkloads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMoodWorkloadState } = moodWorkloadSlice.actions;
export default moodWorkloadSlice.reducer;

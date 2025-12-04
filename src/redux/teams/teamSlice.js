import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTeams, getTeamById } from '../../api/teamService';

// Async thunk for fetching teams
export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (page = 1, { rejectWithValue }) => {
    try {
      return await getTeams(page);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching a single team
export const fetchTeamById = createAsyncThunk(
  'teams/fetchTeamById',
  async (teamId, { rejectWithValue }) => {
    try {
      return await getTeamById(teamId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  teams: [],
  currentTeam: null,
  totalCount: 0,
};

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearTeamState: (state) => {
      state.loading = false;
      state.error = null;
      state.currentTeam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload.results || [];
        state.totalCount = action.payload.count || 0;
        state.error = null;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTeam = action.payload;
        state.error = null;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTeamState } = teamSlice.actions;
export default teamSlice.reducer;

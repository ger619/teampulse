import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTeamFeedbacks, createTeamFeedback, deleteTeamFeedback } from "../../api/teamFeedbackService";

export const fetchFeedbacks = createAsyncThunk(
  "feedbacks/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const data = await fetchTeamFeedbacks(params || {});
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch feedbacks");
    }
  }
);

export const addFeedback = createAsyncThunk(
  "feedbacks/add",
  async ({ message, is_anonymous }, { rejectWithValue }) => {
    try {
      const created = await createTeamFeedback({ message, is_anonymous });
      return created;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create feedback");
    }
  }
);

export const removeFeedback = createAsyncThunk(
  "feedbacks/remove",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTeamFeedback(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete feedback");
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedbacks",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    submitStatus: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      })
      .addCase(addFeedback.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        // Prepend new feedback
        if (action.payload) {
          state.items = [action.payload, ...state.items];
        }
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload || action.error?.message;
      })
      .addCase(removeFeedback.fulfilled, (state, action) => {
        state.items = state.items.filter((f) => f.id !== action.payload);
      });
  },
});

export default feedbackSlice.reducer;

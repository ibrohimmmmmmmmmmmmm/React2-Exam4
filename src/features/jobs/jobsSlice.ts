import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJobById, getPagedJobs, getRecommendedJobs } from "../../services/jobService";
import type { JobDto } from "../../types/api";

export interface JobsState {
  jobs: JobDto[];
  selectedJob: JobDto | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  detailStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  detailError: string | null;
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  status: "idle",
  detailStatus: "idle",
  error: null,
  detailError: null,
};

export const loadRecommendedJobs = createAsyncThunk<JobDto[], string, { rejectValue: string }>(
  "jobs/loadRecommendedJobs",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getRecommendedJobs(userId);
      return response.data?.data ?? response.data ?? [];
    } catch (error: any) {
      if (error.response?.status === 404) {
        const fallback = await getPagedJobs();
        return fallback.data?.data ?? fallback.data ?? [];
      }
      return rejectWithValue(error.response?.data?.message || error.message || "Unable to load recommended jobs.");
    }
  },
);

export const loadJobById = createAsyncThunk<JobDto, string, { rejectValue: string }>(
  "jobs/loadJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await getJobById(jobId);
      return response.data?.data ?? response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Unable to load job details.");
    }
  },
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRecommendedJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadRecommendedJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(loadRecommendedJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load recommended jobs.";
      })
      .addCase(loadJobById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(loadJobById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedJob = action.payload;
      })
      .addCase(loadJobById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || "Unable to load job details.";
      });
  },
});

export default jobsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser, fetchJobApplicationsByUser, fetchProfileByUserId } from "../../services/profileService";
import type { ProfileDto, UserDto } from "../../types/api";

export interface ProfileState {
  user: UserDto | null;
  profile: ProfileDto | null;
  applicationsCount: number;
  savedJobsCount: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  profile: null,
  applicationsCount: 0,
  savedJobsCount: null,
  isLoading: false,
  error: null,
};

export const loadCandidateProfile = createAsyncThunk<
  {
    user: UserDto;
    profile: ProfileDto | null;
    applicationsCount: number;
    savedJobsCount: number | null;
  },
  void,
  { rejectValue: string }
>(
  "profile/loadCandidateProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCurrentUser();
      const rawUser = response.data?.data ?? response.data;
      const user = rawUser?.user ?? rawUser;
      const userId = String(user?.id ?? user?._id ?? user?.userId ?? "");

      if (!userId) {
        return rejectWithValue("Unable to resolve authenticated user.");
      }

      let profileData = null;
      try {
        const profileResponse = await fetchProfileByUserId(userId);
        profileData = profileResponse.data?.data ?? profileResponse.data ?? null;
      } catch {
        profileData = null;
      }

      let applicationsCount = 0;
      try {
        const applicationsResponse = await fetchJobApplicationsByUser(userId);
        const applications = applicationsResponse.data?.data ?? applicationsResponse.data;
        applicationsCount = Array.isArray(applications) ? applications.length : 0;
      } catch {
        applicationsCount = 0;
      }

      return {
        user,
        profile: profileData,
        applicationsCount,
        savedJobsCount: null,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Unable to load profile.");
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCandidateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCandidateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.applicationsCount = action.payload.applicationsCount;
        state.savedJobsCount = action.payload.savedJobsCount;
        state.error = null;
      })
      .addCase(loadCandidateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load candidate profile.";
      });
  },
});

export default profileSlice.reducer;

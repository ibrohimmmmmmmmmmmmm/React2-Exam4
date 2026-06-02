// features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginService } from "../../services/authService";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  user: any;
  role: "candidate" | "organization" | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: null,
  role: localStorage.getItem("role") as "candidate" | "organization" | null || null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("token"),
  error: null,
};

// Login async thunk
export const loginUser = createAsyncThunk<
  { token: string; user: any; role: "candidate" | "organization" | null },
  LoginPayload,
  { rejectValue: string }
>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginService(credentials);
      const { token, user, role } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      return { token, user, role };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

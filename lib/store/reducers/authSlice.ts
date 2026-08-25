import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "@/types";
import { loginThunk, signUpThunk } from "../actions/authThunk";

type AuthState = {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;

        state.isAuthenticated = true;
      })

      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = (action.payload as string) || "Something went wrong";

        state.isAuthenticated = false;
      })

      // SignUp
      .addCase(signUpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;

        state.isAuthenticated = true;
      })

      .addCase(signUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";

        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { getUsersThunk } from "../actions/userThunk";
import { IUser } from "@/types";

type UserState = {
  users: IUser[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  users: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",

  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.users = action.payload;
      })

      .addCase(getUsersThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = (action.payload as string) || "Something went wrong";
      });
  },
});

export default userSlice.reducer;

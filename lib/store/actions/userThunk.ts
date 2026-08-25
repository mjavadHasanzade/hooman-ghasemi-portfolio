import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsersApi } from "@/api";

export const getUsersThunk = createAsyncThunk(
  "users/list",

  async (_, thunkAPI) => {
    try {
      return await getUsersApi();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, signUpApi } from "@/api";
import { LoginPayload, SignUpPayload } from "@/types";

export const loginThunk = createAsyncThunk(
  "auth/login",

  async (payload: LoginPayload, thunkAPI) => {
    try {
      return await loginApi(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message,
      );
    }
  },
);

export const signUpThunk = createAsyncThunk(
  "auth/signUp",

  async (payload: SignUpPayload, thunkAPI) => {
    try {
      return await signUpApi(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message,
      );
    }
  },
);

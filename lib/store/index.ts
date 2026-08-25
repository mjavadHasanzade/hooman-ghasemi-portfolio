import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/store/reducers/authSlice";
import userReducer from "@/lib/store/reducers/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

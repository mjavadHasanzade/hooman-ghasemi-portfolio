import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import type { RootState, AppDispatch } from "../lib/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();

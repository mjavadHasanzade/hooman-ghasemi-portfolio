"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";

const DashboardDirectionContext = createContext(false);

// Content locale belongs to the editor; dashboard chrome always stays Persian.
export function DashboardDirectionProvider({ children }: { children: ReactNode }) {
  return (
    <DashboardDirectionContext.Provider value={true}>
      <DirectionProvider direction="rtl">{children}</DirectionProvider>
    </DashboardDirectionContext.Provider>
  );
}

export function useDashboardDirection() {
  return useContext(DashboardDirectionContext) ? "rtl" : undefined;
}

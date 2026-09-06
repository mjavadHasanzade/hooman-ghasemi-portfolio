"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/use-auth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <span className="font-medium">{user?.name}</span>
          <span className="ms-2 text-muted-foreground">{user?.email}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} title="خروج">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

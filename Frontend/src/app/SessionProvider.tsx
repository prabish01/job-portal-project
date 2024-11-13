"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

interface SessionContextType {
  session: any | null;
}

const SessionContext = createContext<SessionContextType>({ session: null });

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: () => {
      const sessionData = localStorage.getItem("session");
      if (sessionData) {
        document.cookie = `sessionToken=${sessionData}; path=/`;
        return JSON.parse(sessionData);
      }
      return null;
    },
    staleTime: Infinity,
  });

  return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context.session;
}

"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { fetchSession } from "./sessionUtils";

// Define the context type to include session data or null
interface SessionContextType {
  session: any | null;
}

// Create the context with a default value of null
const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    // Fetch the session from localStorage on the client side
    const sessionData = fetchSession();
    setSession(sessionData);
  }, []);

  return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>;
}

// Custom function to get the session context
export default function getSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("getSession must be used within a SessionProvider");
  }
  return context.session;
}

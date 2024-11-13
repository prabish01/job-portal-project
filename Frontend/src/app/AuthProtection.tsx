"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuthProtection } from "./ProtectedAuthMiddleware";

interface AuthProtectionProps {
  children: ReactNode;
}

export function AuthProtection({ children }: AuthProtectionProps) {
  const pathname = usePathname();
  useAuthProtection(pathname);

  return <>{children}</>;
}

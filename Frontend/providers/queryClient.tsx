"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

interface QueryClientProviderComponentProps {
  children: ReactNode;
}

export default function QCProviderComponent({ children }: QueryClientProviderComponentProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

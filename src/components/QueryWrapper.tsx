"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query";
import { ReactNode } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

interface QueryWrapperProps {
  children: ReactNode;
}

export default function QueryWrapper({ children }: QueryWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

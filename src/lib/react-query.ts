"use client";

import { QueryClient } from "@tanstack/react-query";

// Create a global query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

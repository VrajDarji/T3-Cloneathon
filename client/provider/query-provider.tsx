"use client";
import React from "react";
import {
  QueryClient,
  DefaultOptions,
  QueryClientProvider,
} from "@tanstack/react-query";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryConfig: DefaultOptions = {
    queries: { refetchOnWindowFocus: false, retry: false },
  };

  const queryClient = new QueryClient({ defaultOptions: queryConfig });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;

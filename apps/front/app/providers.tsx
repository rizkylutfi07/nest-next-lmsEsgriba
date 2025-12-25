"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./theme-provider";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // No fetch interceptor needed - api-client.ts handles dynamic URLs correctly

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

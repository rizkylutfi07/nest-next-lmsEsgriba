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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { protocol, hostname } = window.location;
    const lanApiBase = `${protocol}//${hostname}:3001`;
    const originalFetch = window.fetch.bind(window);

    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const normalizeUrl = (url: string) =>
        url.startsWith("http://localhost:3001") ? url.replace("http://localhost:3001", lanApiBase) : url;

      if (typeof input === "string") {
        return originalFetch(normalizeUrl(input), init);
      }

      if (input instanceof URL) {
        const nextUrl = new URL(input.toString());
        if (nextUrl.href.startsWith("http://localhost:3001")) {
          nextUrl.host = `${hostname}:3001`;
          nextUrl.protocol = protocol;
        }
        return originalFetch(nextUrl, init);
      }

      const request = input as Request;
      if (request.url.startsWith("http://localhost:3001")) {
        const nextRequest = new Request(
          normalizeUrl(request.url),
          request instanceof Request ? request : undefined,
        );
        return originalFetch(nextRequest, init);
      }

      return originalFetch(request, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

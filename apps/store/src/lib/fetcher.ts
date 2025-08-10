"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

interface FetcherResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

class FetcherError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'FetcherError';
  }
}

// Server-side fetcher (for API routes)
export async function serverFetcher<T = any>(
  url: string,
  options: FetcherOptions = {}
): Promise<FetcherResponse<T>> {
  const { method = 'GET', body, headers = {} } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new FetcherError(
        data.error || 'Request failed',
        response.status,
        data
      );
    }

    return { data, status: response.status };
  } catch (error) {
    if (error instanceof FetcherError) {
      throw error;
    }
    throw new FetcherError(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}

// Client-side fetcher with auth handling
export function useFetcher() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const clientFetcher = async <T = any>(
    url: string,
    options: FetcherOptions = {}
  ): Promise<FetcherResponse<T>> => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      const currentPath = window.location.pathname;
      console.log('Redirecting unauthenticated user to login from:', currentPath);
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      throw new FetcherError('Authentication required', 401);
    }

    if (status === 'loading') {
      console.log('Session still loading, waiting...');
      throw new FetcherError('Session loading', 401);
    }

    const { method = 'GET', body, headers = {} } = options;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (response.status === 401) {
        // Unauthorized, redirect to login
        const currentPath = window.location.pathname;
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
        throw new FetcherError('Authentication required', 401);
      }

      if (!response.ok) {
        throw new FetcherError(
          data.error || 'Request failed',
          response.status,
          data
        );
      }

      return { data, status: response.status };
    } catch (error) {
      if (error instanceof FetcherError) {
        throw error;
      }
      throw new FetcherError(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  };

  return {
    fetcher: clientFetcher,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    session,
  };
}



/**
 * @file    main.tsx
 * @desc    Point d'entrée React — QueryClient, SessionVerifier, Router.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { SessionVerifier } from '@/components/layout/SessionVerifier';
import { AppRouter } from '@/router';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SessionVerifier>
          <AppRouter />
        </SessionVerifier>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);

/**
 * @file    ErrorBoundary.tsx
 * @module  components/layout
 * @desc    Boundary React capturant les erreurs de rendu non gérées.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Affiche un écran de secours en cas d'erreur React inattendue.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-cnss-bg px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Une erreur est survenue</h1>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            L&apos;application a rencontré un problème inattendu. Rechargez la page ou contactez l&apos;administrateur.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Recharger la page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

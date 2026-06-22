/**
 * @file    toastStore.ts
 * @module  store
 * @desc    Notifications toast éphémères (succès / erreur).
 */

import { create } from 'zustand';

export type ToastVariant = 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, variant: ToastVariant) => void;
  dismiss: (id: string) => void;
}

const TOAST_DURATION_MS = 5000;

let toastCounter = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  show: (message, variant) => {
    const id = `toast-${++toastCounter}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));

    window.setTimeout(() => {
      get().dismiss(id);
    }, TOAST_DURATION_MS);
  },

  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export function showSuccessToast(message: string): void {
  useToastStore.getState().show(message, 'success');
}

export function showErrorToast(message: string): void {
  useToastStore.getState().show(message, 'error');
}

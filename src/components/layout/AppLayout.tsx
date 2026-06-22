/**
 * @file    AppLayout.tsx
 * @module  components/layout
 */

import { Outlet } from 'react-router-dom';
import { ToastContainer } from '@/components/ui/Toast';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-cnss-bg">
      <Header />
      <div className="flex pt-14">
        <Sidebar />
        <main className="ml-60 min-h-[calc(100vh-3.5rem)] flex-1 overflow-auto p-6 max-lg:ml-0">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

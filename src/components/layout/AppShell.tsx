import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { ButterflyLayer } from '../ui/ButterflyLayer';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-rose-50 font-sans">
      <ButterflyLayer />
      <main className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

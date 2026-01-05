'use client';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '@/context/UserContext';
//import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { WagmiProvider } from 'wagmi';
//import { config } from '@/lib/wagmi-config';

// const queryClient = new QueryClient()
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
       
           {children}
       

      </UserProvider>
    </SessionProvider>
  );
}
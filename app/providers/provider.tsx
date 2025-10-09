'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'viem/chains';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'wallet', 'google', 'twitter'],
        appearance: {
          theme: 'light',
          accentColor: '#9333EA', // purple to match your design
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: base,
        supportedChains: [base],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
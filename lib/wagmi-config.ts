import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { walletConnect, injected } from 'wagmi/connectors';

// Get your project ID from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(), // Metamask browser extension
    walletConnect({ 
      projectId,
      metadata: {
        name: 'CryptoSnoop',
        description: 'Track your crypto portfolio',
        url: 'https://cryptosnoop.app',
        icons: ['https://cryptosnoop.app/cryptosnooplogo1.png']
      }
    }),
  ],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'),
  },
});
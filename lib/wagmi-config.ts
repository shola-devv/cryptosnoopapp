import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from '@wagmi/connectors/injected'
import { walletConnect } from '@wagmi/connectors/walletConnect'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'CryptoSnoop',
        description: 'Crypto Portfolio Tracker',
        url: 'https://cryptosnoop.app',
        icons: ['https://cryptosnoop.app/cryptosnooplogo1.png']
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
})
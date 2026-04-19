import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

export const config = getDefaultConfig({
  appName: 'Vault Crypto Demo',
  projectId: 'YOUR_PROJECT_ID', 
  chains: [mainnet, polygon, optimism, arbitrum, base],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
  },
});

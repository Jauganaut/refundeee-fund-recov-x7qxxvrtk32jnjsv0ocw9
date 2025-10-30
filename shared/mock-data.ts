import type { CryptoWallet } from './types';
export const MOCK_WALLETS: CryptoWallet[] = [
  {
    id: 'w1',
    cryptocurrency: 'BTC',
    wallet_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    network: 'Bitcoin',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'w2',
    cryptocurrency: 'ETH',
    wallet_address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    network: 'Ethereum (ERC20)',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'w3',
    cryptocurrency: 'USDT',
    wallet_address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    network: 'Ethereum (ERC20)',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];
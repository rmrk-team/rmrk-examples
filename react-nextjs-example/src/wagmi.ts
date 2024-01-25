import { http, createConfig, createStorage } from 'wagmi';
import { hardhat, mainnet, sepolia, base } from 'wagmi/chains';
import { Transport } from 'viem';

const chains = [mainnet, sepolia, hardhat, base] as const;

const transports: Record<number, Transport> = {};

for (const chain of chains) {
  transports[chain.id] = http();
}

export const config = createConfig({
  ssr: true,
  chains,
  transports,
  storage: createStorage({ key: 'rmrk-chunkies-example', storage: localStorage }),
});

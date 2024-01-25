import { http, createConfig, createStorage } from 'wagmi';
import { hardhat, mainnet, sepolia, base } from 'wagmi/chains';
import { Transport } from 'viem';
import { del, get, set } from 'idb-keyval'

const storage = createStorage({
  key: 'rmrk-chunkies-example',
  storage: {
    async getItem(name) {
      return get(name)
    },
    async setItem(name, value) {
      await set(name, value)
    },
    async removeItem(name) {
      await del(name)
    },
  },
})

const chains = [mainnet, sepolia, hardhat, base] as const;

const transports: Record<number, Transport> = {};

for (const chain of chains) {
  transports[chain.id] = http();
}

export const config = createConfig({
  ssr: true,
  chains,
  transports,
  storage,
});

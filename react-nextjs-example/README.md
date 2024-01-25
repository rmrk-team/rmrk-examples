This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-wagmi`](https://github.com/wevm/wagmi/tree/main/packages/create-wagmi).

This is a simple UI to preview your NFTs. At the moment it just renders the NFT and all of it's equipped nested NFTs. This example will include a code for inventory preview and inventory management in the future.

## Getting Started

If you followed the instructions on the Chunkies [README](../contract-examples/chunkies/README.md), you should have utility contract addresses in your terminal window. You can now enter them in a custom rmrkConfig passed to `RMRKContextProvider` [in this file](../react-nextjs-example/src/app/providers.tsx).

Then run

```bash
yarn dev
```
And you should be able to preview your NFT by going to `https://localhost:3002/31337/${chunkiesContractAddress}/1` (Your dev server might be running on a different port), where `31337` is hardhat network chainId

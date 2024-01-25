'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from '@/wagmi';
import { NETWORK_CONTRACTS_PROPS, RMRKUtilityContracts } from '@rmrk-team/rmrk-evm-utils';
import { hardhat } from 'wagmi/chains';
import { RMRKContextProvider } from '@rmrk-team/rmrk-hooks';

// You can pass custom utility contracts to the RMRKContextProvider
const customUtilityContracts = {
  [hardhat.id]: {
    [NETWORK_CONTRACTS_PROPS.RMRKEquipRenderUtils]: '0xC85F2c1780343838E34DEFa87Dc53793CF52A759',
    [NETWORK_CONTRACTS_PROPS.RMRKBulkWriter]: '0x525263A85Df6603802Db0fba1c1a0B3ab55467D2',
    [NETWORK_CONTRACTS_PROPS.RMRKCollectionUtils]: '0x84145c8766c464432ebdf3B0FFCdda5194F74cE8',
    [NETWORK_CONTRACTS_PROPS.RMRKCatalogUtils]: '0x8F9F31aB99030A835D2181166dd875e9EB132dDe',
  },
} satisfies RMRKUtilityContracts;

const rmrkConfig = {
  utilityContracts: customUtilityContracts,
};

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RMRKContextProvider config={rmrkConfig}>{children}</RMRKContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

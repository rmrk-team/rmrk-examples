'use client';

import { Address } from 'viem';
import dynamic from "next/dynamic";

const ComposableRendererContainer = dynamic(
    () => import('@/components/nft-rendering/composable-renderer-container').then(c => c.ComposableRendererContainer),
    {
      ssr: false,
    },
);

export default function TokenDisplay({
  params,
}: {
  params: { chainId: string; contractAddress: Address; tokenId: string };
}) {
  const { chainId: chainIdString, contractAddress, tokenId } = params;
  const chainId = parseInt(chainIdString);

  return (
    <ComposableRendererContainer chainId={chainId} contractAddress={contractAddress} tokenId={BigInt(tokenId)} />
  );
}

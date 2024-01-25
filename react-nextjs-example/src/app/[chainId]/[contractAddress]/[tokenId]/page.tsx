'use client';

import { NFTRenderer } from '@rmrk-team/nft-renderer';
import { Address } from 'viem';

export default function TokenDisplay({
  params,
}: {
  params: { chainId: string; contractAddress: Address; tokenId: string };
}) {
  const { chainId: chainIdString, contractAddress, tokenId } = params;
  const chainId = parseInt(chainIdString);

  return (
    <div className="token-container">
      <div className="token-container-inner">
        <NFTRenderer
          chainId={chainId}
          contractAddress={contractAddress}
          tokenId={BigInt(tokenId)}
        />
      </div>
    </div>
  );
}

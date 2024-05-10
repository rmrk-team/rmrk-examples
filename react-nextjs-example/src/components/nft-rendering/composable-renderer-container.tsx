import { NFTRenderer } from '@rmrk-team/nft-renderer';
import { Address, Chain } from 'viem';

export const ComposableRendererContainer = ({
  chainId,
  contractAddress,
  tokenId,
}: {
  chainId: Chain['id'];
  contractAddress: Address;
  tokenId: bigint;
}) => {
  return (
    <div className="token-container">
      <div className="token-container-inner">
        <NFTRenderer chainId={chainId} contractAddress={contractAddress} tokenId={tokenId} />
      </div>
    </div>
  );
};

// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;
import "@rmrk-team/evm-contracts/contracts/implementations/premint/RMRKEquippablePreMint.sol";

contract Chunky is RMRKEquippablePreMint {
    // Constructor
    constructor(
          string memory collectionMetadata,
          uint256 maxSupply,
          address royaltyRecipient,
          uint16 royaltyPercentageBps
      )
          RMRKEquippablePreMint(
              "Chunky",
              "CHNK",
              collectionMetadata,
              maxSupply,
              royaltyRecipient,
              royaltyPercentageBps
          )
      {}

    function mintWithEquippableAsset(
        address to,
        string memory tokenURI,
        uint64 equippableGroupId,
        address catalogAddress,
        string memory metadataURI,
        uint64[] memory partIds
    ) public payable {
        uint256 tokenId = mint(to, 1, tokenURI);
        uint256 assetId = addEquippableAssetEntry(equippableGroupId, catalogAddress, metadataURI, partIds);
        addAssetToToken(tokenId, uint64(assetId), 0);
        // This implementation auto accepts first asset, if it weren't the case we could do:
        // _acceptAsset(tokenId, 0, uint64(assetId)); // This is an internal call which bypasses accepting by owner. Recommended only during minting.
    }
}
  
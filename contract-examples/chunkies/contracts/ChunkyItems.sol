// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {RMRKEquippablePreMint} from "@rmrk-team/evm-contracts/contracts/implementations/premint/RMRKEquippablePreMint.sol";


contract ChunkyItems is RMRKEquippablePreMint {
    // Events 
    // Variables

    // Constructor
    constructor(
          string memory collectionMetadata,
          uint256 maxSupply,
          address royaltyRecipient,
          uint16 royaltyPercentageBps
    )
          RMRKEquippablePreMint(
              "ChunkyItems",
              "CHNKITM",
              collectionMetadata,
              maxSupply,
              royaltyRecipient,
              royaltyPercentageBps
          )
      {}
      
    // Methods
    function addHandItemAssets(
        uint64 slotForLeftHand,
        uint64 slotForRightHand,
        string memory assetForLeftHand,
        string memory assetForRightHand
    ) public {
        addEquippableAssetEntry(slotForLeftHand, address(0), assetForLeftHand, new uint64[](0));
        addEquippableAssetEntry(slotForRightHand, address(0), assetForRightHand, new uint64[](0));
    }

    function nestMintWithAssets(
        address to,
        uint256 destinationId,
        string memory tokenURI,
        uint64[] memory assetIds
    ) public virtual onlyOwnerOrContributor {
        uint256 tokenId = nestMint(to, 1, destinationId, tokenURI);
        uint256 length = assetIds.length;
        for (uint256 i = 0; i < length; i++) {
            addAssetToToken(tokenId, assetIds[i], 0);
            // Only first asset or assets added by token owner are auto-accepted, so we might need to accept for the rest of cases
            if (_pendingAssets[tokenId].length != 0) {
                _acceptAsset(tokenId, 0 , assetIds[i]);
            }
        }
    }
}
  
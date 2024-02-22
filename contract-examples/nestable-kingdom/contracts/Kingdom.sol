// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {RMRKEquippablePreMint} from "@rmrk-team/evm-contracts/contracts/implementations/premint/RMRKEquippablePreMint.sol";


contract Kingdom is RMRKEquippablePreMint {
    // Events 
    // Variables
    mapping(address => bool) private _autoAcceptCollection;

    // Constructor
    constructor(
          string memory collectionMetadata,
          uint256 maxSupply,
          address royaltyRecipient,
          uint16 royaltyPercentageBps
    )
          RMRKEquippablePreMint(
              "Kingdom",
              "KD",
              collectionMetadata,
              maxSupply,
              royaltyRecipient,
              royaltyPercentageBps
          )
      {}
      
    // Methods
    function setAutoAcceptCollection(
        address collection,
        bool autoAccept
    ) public virtual onlyOwnerOrContributor {
        _autoAcceptCollection[collection] = autoAccept;
    }

    function _afterAddChild(
        uint256 tokenId,
        address childAddress,
        uint256 childId,
        bytes memory
    ) internal virtual override {
        // Auto accept children if they are from known collections
        if (_autoAcceptCollection[childAddress]) {
            _acceptChild(
                tokenId,
                _pendingChildren[tokenId].length - 1,
                childAddress,
                childId
            );
        }
    }
    
}
  
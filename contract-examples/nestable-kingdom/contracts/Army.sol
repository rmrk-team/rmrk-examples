// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;
import "@rmrk-team/evm-contracts/contracts/implementations/premint/RMRKNestablePreMint.sol";

contract Army is RMRKNestablePreMint {
    // Variables
    mapping(address => bool) private _autoAcceptCollection;

    // Constructor
    constructor(
          string memory collectionMetadata,
          uint256 maxSupply,
          address royaltyRecipient,
          uint16 royaltyPercentageBps
      )
          RMRKNestablePreMint(
              "Army",
              "ARM",
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
    ) public virtual onlyOwner {
        _autoAcceptCollection[collection] = autoAccept;
    }

    function _afterAddChild(
        uint256 tokenId,
        address childAddress,
        uint256 childId,
        bytes memory
    ) internal override {
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
  
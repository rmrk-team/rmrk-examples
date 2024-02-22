// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {RMRKMultiAssetPreMint} from "@rmrk-team/evm-contracts/contracts/implementations/premint/RMRKMultiAssetPreMint.sol";


contract CookBook is RMRKMultiAssetPreMint {
    // Events 
    // Variables

    // Constructor
    constructor(
          string memory collectionMetadata,
          uint256 maxSupply,
          address royaltyRecipient,
          uint16 royaltyPercentageBps
    )
          RMRKMultiAssetPreMint(
              "CookBook",
              "CB",
              collectionMetadata,
              maxSupply,
              royaltyRecipient,
              royaltyPercentageBps
          )
      {}
      
    // Methods
}
  
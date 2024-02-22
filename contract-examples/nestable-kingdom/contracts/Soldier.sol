// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {RMRKNestablePreMint} from "@rmrk-team/evm-contracts/contracts/implementations/premint/RMRKNestablePreMint.sol";


contract Soldier is RMRKNestablePreMint {
    // Events 
    // Variables

    // Constructor
    constructor(
          string memory collectionMetadata,
          uint256 maxSupply,
          address royaltyRecipient,
          uint16 royaltyPercentageBps
    )
          RMRKNestablePreMint(
              "Soldier",
              "SD",
              collectionMetadata,
              maxSupply,
              royaltyRecipient,
              royaltyPercentageBps
          )
      {}
      
    // Methods
}
  
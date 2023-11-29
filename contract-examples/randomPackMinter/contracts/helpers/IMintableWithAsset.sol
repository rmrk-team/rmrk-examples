// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {IERC6220} from "@rmrk-team/evm-contracts/contracts/RMRK/equippable/IERC6220.sol";
import "@rmrk-team/evm-contracts/contracts/implementations/RMRKCatalogImpl.sol"; // So typechain catches it

interface IMintableWithAsset is IERC6220 {
    function mint(address to, uint64 assetId) external returns (uint256);

    function nestMint(
        address to,
        uint256 destinationId,
        uint64 assetId
    ) external returns (uint256);

    function transferFrom(address from, address to, uint256 tokenId) external;
}

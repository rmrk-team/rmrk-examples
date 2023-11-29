// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractEquippable.sol";

contract Child is RMRKAbstractEquippable {
    using Strings for uint256;

    constructor(
        string memory name,
        string memory symbol,
        string memory collectionMetadata,
        uint256 maxSupply,
        address royaltyRecipient,
        uint16 royaltyPercentageBps
    )
        RMRKImplementationBase(
            name,
            symbol,
            collectionMetadata,
            maxSupply,
            royaltyRecipient,
            royaltyPercentageBps
        )
    {}

    /**
     * @notice Used to mint a one child token to a given parent token.
     * @dev The "data" value of the "_safeMint" method is set to an empty value.
     * @param to Address of the collection smart contract of the token into which to mint the child token
     * @param destinationId ID of the token into which to mint the new child token
     * @param assetId ID of the asset to add to the token
     * @return The ID of the first token to be minted in the current minting cycle
     */
    function nestMint(
        address to,
        uint256 destinationId,
        uint64 assetId
    ) public onlyOwnerOrContributor returns (uint256) {
        (uint256 nextToken, ) = _prepareMint(1);
        _nestMint(to, nextToken, destinationId, "");
        _addAssetToToken(nextToken, assetId, 0);
        // First asset is auto accepted

        return nextToken;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        _requireMinted(tokenId);
        return getAssetMetadata(tokenId, _activeAssets[tokenId][0]);
    }

    /**
     * @notice Used to add multiple assets.
     * @param baseURI Base URI of the assets
     * @param extension Extension of the assets
     * @param numberOfAssets Number of assets to add
     * @param equippableGroupId Equippable group id to group the assets if they want to be equipped into the same parent slot
     */
    function batchAddAssets(
        string memory baseURI,
        string memory extension,
        uint256 numberOfAssets,
        uint64 equippableGroupId
    ) external onlyOwnerOrContributor {
        for (uint256 i; i < numberOfAssets; ) {
            unchecked {
                ++_totalAssets;
            }
            _addAssetEntry(
                uint64(_totalAssets),
                equippableGroupId,
                address(0),
                string(
                    abi.encodePacked(
                        baseURI,
                        _totalAssets.toString(),
                        extension
                    )
                ),
                new uint64[](0)
            );
            unchecked {
                ++i;
            }
        }
    }

    function lockSupply() external onlyOwner {
        _maxSupply = _totalSupply;
    }
}

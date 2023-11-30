// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractEquippable.sol";

error NotMinter();

contract Parent is RMRKAbstractEquippable {
    using Strings for uint256;

    // Variables
    mapping(address => bool) private _autoAcceptCollection;
    address private _minter;

    // Constructor
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
     * @notice Used to set the minter.
     * @dev Can only be called by the owner.
     * @param minter Address of the minter
     */
    function setMinter(address minter) external onlyOwner {
        _minter = minter;
    }

    // Suggested Mint Functions
    /**
     * @notice Used to mint the desired number of tokens to the specified address.
     * @dev The data value of the _safeMint method is set to an empty value.
     * @dev Can only be called by the minter.
     * @param to Address to which to mint the token
     * @param assetId ID of the asset to add to the token
     * @return The ID of the minted token
     */
    function mint(address to, uint64 assetId) public returns (uint256) {
        if (_minter != msg.sender) {
            revert NotMinter();
        }
        (uint256 nextToken, ) = _prepareMint(1);

        _safeMint(to, nextToken, "");
        _addAssetToToken(nextToken, assetId, 0);
        // First asset is auto accepted

        return nextToken;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        _requireMinted(tokenId);
        return getAssetMetadata(tokenId, _activeAssets[tokenId][0]);
    }

    /**
     * @notice Used to add multiple assets. For each asset, an equippable asset will be created including a fixed part matching the asset id, and all the slot parts.
     * @dev This should only be called once since assetIds and partIds are expected to start at 1.
     * @param baseURI Base URI of the assets
     * @param extension Extension of the assets
     * @param numberOfAssets Number of assets to add, first asset will have ID 1 and append partId 1, second 2, etc.
     * @param equippableGroupId Equippable group id to group the assets if they want to be equipped into the same parent slot
     * @param catalog Address of the catalog contract
     * @param slotPartIds Array of slot part IDs to be included in the equippable asset
     */
    function batchAddAssets(
        string memory baseURI,
        string memory extension,
        uint256 numberOfAssets,
        uint64 equippableGroupId,
        address catalog,
        uint64[] memory slotPartIds
    ) external onlyOwnerOrContributor {
        uint64[] memory extendedPartIds = new uint64[](slotPartIds.length + 1);
        for (uint256 i; i < slotPartIds.length; ) {
            extendedPartIds[i] = slotPartIds[i];
            unchecked {
                ++i;
            }
        }
        for (uint256 i; i < numberOfAssets; ) {
            unchecked {
                ++_totalAssets;
            }
            uint64 fixedPartAndAssetId = uint64(_totalAssets);
            extendedPartIds[slotPartIds.length] = fixedPartAndAssetId;
            _addAssetEntry(
                fixedPartAndAssetId,
                equippableGroupId,
                catalog,
                string(
                    abi.encodePacked(
                        baseURI,
                        _totalAssets.toString(),
                        extension
                    )
                ),
                extendedPartIds
            );
            unchecked {
                ++i;
            }
        }
    }

    function lockSupply() external onlyOwner {
        _maxSupply = _totalSupply;
    }

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

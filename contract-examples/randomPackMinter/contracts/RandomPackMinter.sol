// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {Ownable} from "@rmrk-team/evm-contracts/contracts/RMRK/access/Ownable.sol";
import {IERC6220} from "@rmrk-team/evm-contracts/contracts/RMRK/equippable/IERC6220.sol";
import {IMintableWithAsset} from "./helpers/IMintableWithAsset.sol";

error FailedToSend();
error IncorrectOdds();
error IncorrectValueSent();

contract RandomPackMinter is Ownable, IERC721Receiver {
    event PackMinted(
        address indexed to,
        uint256 indexed packId,
        uint64 parentAssetId,
        uint64 backgroundAssetId,
        uint64 glassesAssetId,
        uint64 handsAssetId,
        uint64 hatAssetId,
        uint64 shirtAssetId
    );

    IMintableWithAsset private _parent;
    IMintableWithAsset private _backgrounds;
    IMintableWithAsset private _glasses;
    IMintableWithAsset private _hands;
    IMintableWithAsset private _hats;
    IMintableWithAsset private _shirts;

    uint256[] private _parentAssetOdds;
    uint256[] private _backgroundsAssetOdds;
    uint256[] private _glassesAssetOdds;
    uint256[] private _handsAssetOdds;
    uint256[] private _hatsAssetOdds;
    uint256[] private _shirtsAssetOdds;

    uint64 private constant BACKGROUNDS_SLOT_ID = 1001;
    uint64 private constant GLASSES_SLOT_ID = 1002;
    uint64 private constant HANDS_SLOT_ID = 1003;
    uint64 private constant HATS_SLOT_ID = 1004;
    uint64 private constant SHIRTS_SLOT_ID = 1005;

    uint256 private _packsMinted;
    uint256 private _mintPrice;
    address private _beneficiary;

    constructor(
        address beneficiary,
        address parent,
        address backgrounds,
        address glasses,
        address hands,
        address hats,
        address shirts,
        uint256 mintPrice
    ) {
        _beneficiary = beneficiary;
        _parent = IMintableWithAsset(parent);
        _backgrounds = IMintableWithAsset(backgrounds);
        _glasses = IMintableWithAsset(glasses);
        _hands = IMintableWithAsset(hands);
        _hats = IMintableWithAsset(hats);
        _shirts = IMintableWithAsset(shirts);
        _mintPrice = mintPrice;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function getBeneficiary() external view returns (address) {
        return _beneficiary;
    }

    function getAddresses()
        external
        view
        returns (
            address parent,
            address backgrounds,
            address glasses,
            address hands,
            address hats,
            address shirts
        )
    {
        parent = address(_parent);
        backgrounds = address(_backgrounds);
        glasses = address(_glasses);
        hands = address(_hands);
        hats = address(_hats);
        shirts = address(_shirts);
    }

    function getTotalAssets()
        external
        view
        returns (
            uint256 parent,
            uint256 backgrounds,
            uint256 glasses,
            uint256 hands,
            uint256 hats,
            uint256 shirts
        )
    {
        parent = _parentAssetOdds.length;
        backgrounds = _backgroundsAssetOdds.length;
        glasses = _glassesAssetOdds.length;
        hands = _handsAssetOdds.length;
        hats = _hatsAssetOdds.length;
        shirts = _shirtsAssetOdds.length;
    }

    function getAssetIds()
        external
        view
        returns (
            uint256[] memory parent,
            uint256[] memory backgrounds,
            uint256[] memory glasses,
            uint256[] memory hands,
            uint256[] memory hats,
            uint256[] memory shirts
        )
    {
        parent = _parentAssetOdds;
        backgrounds = _backgroundsAssetOdds;
        glasses = _glassesAssetOdds;
        hands = _handsAssetOdds;
        hats = _hatsAssetOdds;
        shirts = _shirtsAssetOdds;
    }

    function getPacksMinted() public view returns (uint256) {
        return _packsMinted;
    }

    function getMintPrice() public view returns (uint256) {
        return _mintPrice;
    }

    function setBeneficiary(address beneficiary) external onlyOwner {
        _beneficiary = beneficiary;
    }

    function setAssetOdds(
        uint256[] memory parentOdds,
        uint256[] memory backgroundsOdds,
        uint256[] memory glassesOdds,
        uint256[] memory handsOdds,
        uint256[] memory hatsOdds,
        uint256[] memory shirtsOdds
    ) external onlyOwnerOrContributor {
        delete _parentAssetOdds;
        delete _backgroundsAssetOdds;
        delete _glassesAssetOdds;
        delete _handsAssetOdds;
        delete _hatsAssetOdds;
        delete _shirtsAssetOdds;

        _setOdds(_parentAssetOdds, parentOdds);
        _setOdds(_backgroundsAssetOdds, backgroundsOdds);
        _setOdds(_glassesAssetOdds, glassesOdds);
        _setOdds(_handsAssetOdds, handsOdds);
        _setOdds(_hatsAssetOdds, hatsOdds);
        _setOdds(_shirtsAssetOdds, shirtsOdds);
    }

    function _setOdds(
        uint256[] storage currentOdds,
        uint256[] memory newOdds
    ) private {
        uint256 totalOdds;
        for (uint256 i = 0; i < newOdds.length; i++) {
            totalOdds += newOdds[i];
            currentOdds.push(newOdds[i]);
        }
        if (totalOdds != 100) revert IncorrectOdds();
    }

    function mintPacks(address to, uint256 numPacks) external payable {
        _chargeFee(numPacks);
        for (uint256 i = 0; i < numPacks; i++) {
            _mintParentAndChildren(to);
        }
    }

    function _mintParentAndChildren(address to) private {
        unchecked {
            ++_packsMinted;
        }

        (
            uint64 parentAssetId,
            uint64 backgroundAssetId,
            uint64 glassesAssetId,
            uint64 handsAssetId,
            uint64 hatAssetId,
            uint64 shirtAssetId
        ) = _getAssetIds();

        uint256 parentId = _parent.mint(address(this), parentAssetId);
        _backgrounds.nestMint(address(_parent), parentId, backgroundAssetId);
        _glasses.nestMint(address(_parent), parentId, glassesAssetId);
        _hands.nestMint(address(_parent), parentId, handsAssetId);
        _hats.nestMint(address(_parent), parentId, hatAssetId);
        _shirts.nestMint(address(_parent), parentId, shirtAssetId);

        IERC6220.IntakeEquip memory equipInfo = IERC6220.IntakeEquip({
            tokenId: parentId,
            childIndex: 0,
            assetId: parentAssetId,
            slotPartId: BACKGROUNDS_SLOT_ID,
            childAssetId: backgroundAssetId
        });
        _parent.equip(equipInfo);

        equipInfo.childIndex = 1;
        equipInfo.slotPartId = GLASSES_SLOT_ID;
        equipInfo.childAssetId = glassesAssetId;
        _parent.equip(equipInfo);

        equipInfo.childIndex = 2;
        equipInfo.slotPartId = HANDS_SLOT_ID;
        equipInfo.childAssetId = handsAssetId;
        _parent.equip(equipInfo);

        equipInfo.childIndex = 3;
        equipInfo.slotPartId = HATS_SLOT_ID;
        equipInfo.childAssetId = hatAssetId;
        _parent.equip(equipInfo);

        equipInfo.childIndex = 4;
        equipInfo.slotPartId = SHIRTS_SLOT_ID;
        equipInfo.childAssetId = shirtAssetId;
        _parent.equip(equipInfo);

        _parent.transferFrom(address(this), to, parentId);

        emit PackMinted(
            to,
            _packsMinted,
            parentAssetId,
            backgroundAssetId,
            glassesAssetId,
            handsAssetId,
            hatAssetId,
            shirtAssetId
        );
    }

    function _getAssetIds()
        private
        view
        returns (
            uint64 parentAssetId,
            uint64 backgroundAssetId,
            uint64 glassesAssetId,
            uint64 handsAssetId,
            uint64 hatAssetId,
            uint64 shirtAssetId
        )
    {
        uint256 baseSeed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    msg.sender,
                    _packsMinted
                )
            )
        );
        parentAssetId = _getAssetFromSeed(_parentAssetOdds, baseSeed);
        baseSeed >>= 8;
        backgroundAssetId = _getAssetFromSeed(_backgroundsAssetOdds, baseSeed);
        baseSeed >>= 8;
        glassesAssetId = _getAssetFromSeed(_glassesAssetOdds, baseSeed);
        baseSeed >>= 8;
        handsAssetId = _getAssetFromSeed(_handsAssetOdds, baseSeed);
        baseSeed >>= 8;
        hatAssetId = _getAssetFromSeed(_hatsAssetOdds, baseSeed);
        baseSeed >>= 8;
        shirtAssetId = _getAssetFromSeed(_shirtsAssetOdds, baseSeed);
    }

    function _getAssetFromSeed(
        uint256[] memory odds,
        uint256 seed
    ) private pure returns (uint64) {
        uint256 totalOdds;
        uint256 modSeed = seed % 100;
        for (uint256 i; i < odds.length; ) {
            totalOdds += odds[i];
            unchecked {
                ++i;
            }
            if (modSeed < totalOdds) {
                return uint64(i);
            }
        }
        return uint64(odds.length);
    }

    function _chargeFee(uint256 numPacks) private {
        if (msg.value != _mintPrice * numPacks) {
            revert IncorrectValueSent();
        }
        (bool success, ) = _beneficiary.call{value: msg.value}("");
        if (!success) revert FailedToSend();
    }
}

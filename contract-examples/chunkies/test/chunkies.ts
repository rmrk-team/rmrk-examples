import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { Chunky, ChunkyCatalog, ChunkyItem, RMRKEquipRenderUtils } from '../typechain-types';
import * as C from '../scripts/constants';
import {
  addItemAssets,
  configureCatalog,
  deployContracts,
  mintChunkies,
  mintItems,
} from '../scripts/utils';

async function fixture(): Promise<{
  chunkies: Chunky;
  items: ChunkyItem;
  catalog: ChunkyCatalog;
  renderUtils: RMRKEquipRenderUtils;
}> {
  const [deployer] = await ethers.getSigners();

  const { chunkies, items, catalog } = await deployContracts();
  await configureCatalog(catalog, items.address);
  await mintChunkies(chunkies, catalog.address, deployer);
  await addItemAssets(items, chunkies.address);
  await mintItems(items, chunkies.address);

  const renderUtilsFactory = await ethers.getContractFactory('RMRKEquipRenderUtils');
  const renderUtils = await renderUtilsFactory.deploy();

  return { chunkies, items, catalog, renderUtils };
}

describe('Chunkies', async () => {
  let chunkies: Chunky;
  let renderUtils: RMRKEquipRenderUtils;

  beforeEach(async function () {
    ({ chunkies, renderUtils } = await loadFixture(fixture));
  });

  it('can equip items and chunky is composed as expected', async function () {
    // Chunky 1 has 2 items, a bone and a flag
    await chunkies.equip({
      tokenId: 1,
      childIndex: 0, // Bone is first item
      assetId: 1, // First parent's asset
      slotPartId: C.CHUNKY_LEFT_HAND_SLOT_PART_ID,
      childAssetId: 1, // Bone's asset for left hand
    });
    await chunkies.equip({
      tokenId: 1,
      childIndex: 1, // Flag is second item
      assetId: 1, // First parent's asset
      slotPartId: C.CHUNKY_RIGHT_HAND_SLOT_PART_ID,
      childAssetId: 4, // Flag's asset for right hand
    });

    const expectedComposed = [
      'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/chunkies/full/1.json', // metadataURI
      ethers.BigNumber.from('1'), // equippableGroupId
      '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // catalogAddress
      [
        // Fixed parts
        [
          ethers.BigNumber.from('1'), // partId
          4, // z
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/catalog/fixed/v1/head.json', // metadataURI
        ],
        [
          ethers.BigNumber.from('2'), // partId
          2, // z
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/catalog/fixed/v1/body.json', // metadataURI
        ],
        [
          ethers.BigNumber.from('3'), // partId
          8, // z
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/catalog/fixed/v1/hands.json', // metadataURI
        ],
      ],
      [
        // Slot parts
        [
          ethers.BigNumber.from('1001'), // partId
          ethers.BigNumber.from('1'), // childAssetId
          6, // z
          '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // childAddress
          ethers.BigNumber.from('1'), // childId
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/items/bone/left.json', // childAssetMetadata
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/catalog/slots/left_hand.json', // partMetadata
        ],
        [
          ethers.BigNumber.from('1002'), // partId
          ethers.BigNumber.from('4'), // childAssetId
          6, // z
          '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // childAddress
          ethers.BigNumber.from('6'), // childId
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/items/flag/right.json', // childAssetMetadata
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/catalog/slots/right_hand.json', // partMetadata
        ],
      ],
    ];
    expect(await renderUtils.composeEquippables(chunkies.address, 1, 1)).to.eql(expectedComposed);
  });
});

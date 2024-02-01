import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { Chunkies, RMRKCatalogImpl, ChunkyItems, RMRKEquipRenderUtils } from '../typechain-types';
import * as C from '../scripts/constants';
import {
  addItemAssets,
  configureCatalog,
  deployCatalog,
  deployRenderUtils,
  deployChunkies,
  deployChunkyItems,
  mintChunkies,
  mintItems,
} from '../scripts/deploy-methods';

async function fixture(): Promise<{
  chunkies: Chunkies;
  items: ChunkyItems;
  catalog: RMRKCatalogImpl;
  renderUtils: RMRKEquipRenderUtils;
}> {
  const [deployer] = await ethers.getSigners();

  const chunkies = await deployChunkies();
  const items = await deployChunkyItems();
  const catalog = await deployCatalog(C.CHUNKY_CATALOG_METADATA, C.CHUNKY_CATALOG_TYPE);
  const renderUtils = await deployRenderUtils();

  await chunkies.setAutoAcceptCollection(await items.getAddress(), true);
  await configureCatalog(catalog, await items.getAddress());
  await mintChunkies(chunkies, await catalog.getAddress(), deployer.address);
  await addItemAssets(items, await chunkies.getAddress());
  await mintItems(items, await chunkies.getAddress());

  return { chunkies, items, catalog, renderUtils };
}

describe('Chunkies', async () => {
  let chunkies: Chunkies;
  let renderUtils: RMRKEquipRenderUtils;

  beforeEach(async function () {
    ({ chunkies, renderUtils } = await loadFixture(fixture));
  });

  it('can equip items and chunky is composed as expected', async function () {
    // Chunkies 1 has 2 items, a bone and a flag
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
      1n, // equippableGroupId
      '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // catalogAddress
      [
        // Fixed parts
        [
          1n, // partId
          4n, // z
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/catalog/fixed/v1/head.json', // metadataURI
        ],
        [
          2n, // partId
          2n, // z
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/catalog/fixed/v1/body.json', // metadataURI
        ],
        [
          3n, // partId
          8n, // z
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/catalog/fixed/v1/hand.json', // metadataURI
        ],
      ],
      [
        // Slot parts
        [
          1001n, // partId
          1n, // childAssetId
          6n, // z
          '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // childAddress
          1n, // childId
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/items/bone/left.json', // childAssetMetadata
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/catalog/slots/left_hand.json', // partMetadata
        ],
        [
          1002n, // partId
          4n, // childAssetId
          6n, // z
          '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // childAddress
          6n, // childId
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/items/flag/right.json', // childAssetMetadata
          'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/catalog/slots/right_hand.json', // partMetadata
        ],
      ],
    ];
    expect(await renderUtils.composeEquippables(await chunkies.getAddress(), 1, 1)).to.eql(
      expectedComposed,
    );
  });
});

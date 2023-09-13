import { ethers, run } from 'hardhat';
import { BigNumber } from 'ethers';
import { Chunky, ChunkyItem, ChunkyCatalog } from '../typechain-types';
import * as C from './constants';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

async function deployContracts(): Promise<{
  chunkies: Chunky;
  items: ChunkyItem;
  catalog: ChunkyCatalog;
}> {
  const deployerAddress = (await ethers.getSigners())[0].address;

  const chunkyFactory = await ethers.getContractFactory('Chunky');
  const itemFactory = await ethers.getContractFactory('ChunkyItem');
  const catalogFactory = await ethers.getContractFactory('ChunkyCatalog');

  const chunkyArgs = [
    C.CHUNKY_METADATA,
    BigNumber.from(100),
    deployerAddress,
    500, // 5%
  ] as const;

  const itemArgs = [
    C.CHUNKY_ITEM_METADATA,
    BigNumber.from(200),
    deployerAddress,
    500, // 5%
  ] as const;

  const catalogArgs = [C.CHUNKY_CATALOG_METADATA, 'img'] as const;

  const chunkies: Chunky = await chunkyFactory.deploy(...chunkyArgs);
  await chunkies.deployed();

  const items: ChunkyItem = await itemFactory.deploy(...itemArgs);
  await items.deployed();

  const catalog: ChunkyCatalog = await catalogFactory.deploy(...catalogArgs);
  await catalog.deployed();

  // So holders do not need to accept each item
  await chunkies.setAutoAcceptCollection(items.address);

  const chainId = (await ethers.provider.getNetwork()).chainId;
  if (chainId !== 31337) {
    // Skip verification on local chain
    await run('verify:verify', {
      address: chunkies.address,
      constructorArguments: chunkyArgs,
    });
    await run('verify:verify', {
      address: items.address,
      constructorArguments: itemArgs,
    });
    await run('verify:verify', {
      address: catalog.address,
      contract: 'contracts/ChunkyCatalog.sol:ChunkyCatalog', // Needed so hardhat can distinguish it from RMRKCatalogImpl
      constructorArguments: catalogArgs,
    });
  }

  return { chunkies, items, catalog };
}

async function configureCatalog(catalog: ChunkyCatalog, itemsAddress: string) {
  // Slots
  let tx1 = await catalog.addPartList([
    {
      partId: C.CHUNKY_LEFT_HAND_SLOT_PART_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.Z_INDEX_HAND_ITEMS,
        equippable: [itemsAddress],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/slots/left_hand.json`,
      },
    },
    {
      partId: C.CHUNKY_RIGHT_HAND_SLOT_PART_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.Z_INDEX_HAND_ITEMS,
        equippable: [itemsAddress],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/slots/right_hand.json`,
      },
    },
  ]);
  // Fixed
  let tx2 = await catalog.addPartList([
    {
      partId: C.CHUNKY_V1_HEAD_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_HEAD,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v1/head.json`,
      },
    },
    {
      partId: C.CHUNKY_V1_BODY_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_BODY,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v1/body.json`,
      },
    },
    {
      partId: C.CHUNKY_V1_HANDS_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_HANDS,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v1/hand.json`,
      },
    },
    {
      partId: C.CHUNKY_V2_HEAD_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_HEAD,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v2/head.json`,
      },
    },
    {
      partId: C.CHUNKY_V2_BODY_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_BODY,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v2/body.json`,
      },
    },
    {
      partId: C.CHUNKY_V2_HANDS_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_HANDS,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v2/hand.json`,
      },
    },
    {
      partId: C.CHUNKY_V3_HEAD_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_HEAD,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v3/head.json`,
      },
    },
    {
      partId: C.CHUNKY_V3_BODY_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_BODY,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v3/body.json`,
      },
    },
    {
      partId: C.CHUNKY_V3_HANDS_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_HANDS,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v3/hand.json`,
      },
    },
    {
      partId: C.CHUNKY_V4_HEAD_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_HEAD,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v4/head.json`,
      },
    },
    {
      partId: C.CHUNKY_V4_BODY_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_BODY,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v4/body.json`,
      },
    },
    {
      partId: C.CHUNKY_V4_HANDS_FIXED_PART_ID,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.Z_INDEX_HANDS,
        equippable: [],
        metadataURI: `${C.BASE_IPFS_URI}/catalog/fixed/v4/hand.json`,
      },
    },
  ]);
  await Promise.all([tx1.wait(), tx2.wait()]);
}

async function mintChunkies(chunkies: Chunky, catalogAddress: string, mintTo: SignerWithAddress) {
  // 1st WAY TO DO IT: Step by step
  let tx = await chunkies.addEquippableAssetEntry(
    C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
    catalogAddress, // Catalog address
    `${C.BASE_IPFS_URI}/chunkies/full/1.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
    [
      // Fixed and slots part ids:
      C.CHUNKY_V1_HEAD_FIXED_PART_ID,
      C.CHUNKY_V1_BODY_FIXED_PART_ID,
      C.CHUNKY_V1_HANDS_FIXED_PART_ID,
      C.CHUNKY_LEFT_HAND_SLOT_PART_ID,
      C.CHUNKY_RIGHT_HAND_SLOT_PART_ID,
    ],
  );
  await tx.wait();
  // WARNING: If any asset is added in between, this no longer matches the id of the newly added asset, you can listen to the AssetAdded event and get the assetId from, there.
  const newAssetId = await chunkies.totalAssets();
  tx = await chunkies.mint(mintTo.address, 1, `${C.BASE_IPFS_URI}/chunkies/full/1.json`);
  await tx.wait();
  // WARNING: If any token is burnt or minted this no longer matches the id of the newly minted token, you can listen to the Transfer event and get the tokenId from, there.
  const newTokenId = await chunkies.totalSupply();
  tx = await chunkies.addAssetToToken(newTokenId, newAssetId, 0);
  await tx.wait();

  // If there was no auto accept, the holder of the token would have to accept the asset before it can be used.
  // await chunkies.acceptAsset(newTokenId, 0, newAssetId);

  // 2nd WAY TO DO IT: Custom method on chunkies contract
  tx = await chunkies.mintWithEquippableAsset(
    mintTo.address, // To
    `${C.BASE_IPFS_URI}/chunkies/full/2.json`, // TokenURI
    C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
    catalogAddress, // Catalog address
    `${C.BASE_IPFS_URI}/chunkies/full/2.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
    [
      // Fixed and slots part ids:
      C.CHUNKY_V2_HEAD_FIXED_PART_ID,
      C.CHUNKY_V2_BODY_FIXED_PART_ID,
      C.CHUNKY_V2_HANDS_FIXED_PART_ID,
      C.CHUNKY_LEFT_HAND_SLOT_PART_ID,
      C.CHUNKY_RIGHT_HAND_SLOT_PART_ID,
    ],
  );
  await tx.wait();
  tx = await chunkies.mintWithEquippableAsset(
    mintTo.address, // To
    `${C.BASE_IPFS_URI}/chunkies/full/3.json`, // TokenURI
    C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
    catalogAddress, // Catalog address
    `${C.BASE_IPFS_URI}/chunkies/full/3.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
    [
      // Fixed and slots part ids:
      C.CHUNKY_V3_HEAD_FIXED_PART_ID,
      C.CHUNKY_V3_BODY_FIXED_PART_ID,
      C.CHUNKY_V3_HANDS_FIXED_PART_ID,
      C.CHUNKY_LEFT_HAND_SLOT_PART_ID,
      C.CHUNKY_RIGHT_HAND_SLOT_PART_ID,
    ],
  );
  await tx.wait();
  tx = await chunkies.mintWithEquippableAsset(
    mintTo.address, // To
    `${C.BASE_IPFS_URI}/chunkies/full/4.json`, // TokenURI
    C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
    catalogAddress, // Catalog address
    `${C.BASE_IPFS_URI}/chunkies/full/4.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
    [
      // Fixed and slots part ids:
      C.CHUNKY_V4_HEAD_FIXED_PART_ID,
      C.CHUNKY_V3_BODY_FIXED_PART_ID,
      C.CHUNKY_V3_HANDS_FIXED_PART_ID,
      C.CHUNKY_LEFT_HAND_SLOT_PART_ID,
      C.CHUNKY_RIGHT_HAND_SLOT_PART_ID,
    ],
  );
  await tx.wait();
  tx = await chunkies.mintWithEquippableAsset(
    mintTo.address, // To
    `${C.BASE_IPFS_URI}/chunkies/full/5.json`, // TokenURI
    C.EQUIPPABLE_GROUP_FOR_CHUNKIES_DEFAULT, // Equippable group
    catalogAddress, // Catalog address
    `${C.BASE_IPFS_URI}/chunkies/full/5.json`, // Metadata URI, we are using the same as tokenURI. We could use a fallback one for all.
    [
      // Fixed and slots part ids:
      C.CHUNKY_V3_HEAD_FIXED_PART_ID,
      C.CHUNKY_V4_BODY_FIXED_PART_ID,
      C.CHUNKY_V4_HANDS_FIXED_PART_ID,
      C.CHUNKY_LEFT_HAND_SLOT_PART_ID,
      C.CHUNKY_RIGHT_HAND_SLOT_PART_ID,
    ],
  );
  await tx.wait();
}

async function addItemAssets(items: ChunkyItem, chunkiesAddress: string) {
  // 1st WAY TO DO IT: Adding assets step by step
  let tx = await items.addEquippableAssetEntry(
    C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND, // Equippable group
    ethers.constants.AddressZero, // Catalog address
    `${C.BASE_IPFS_URI}/items/bone/left.json`, // Metadata URI
    [], // Part ids, none since this is not meant to receive any equippable and it is not composed
  );
  await tx.wait();
  tx = await items.addEquippableAssetEntry(
    C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND, // Equippable group
    ethers.constants.AddressZero, // Catalog address
    `${C.BASE_IPFS_URI}/items/bone/right.json`, // Metadata URI
    [], // Part ids, none since this is not meant to receive any equippable and it is not composed
  );
  await tx.wait();

  // 2nd WAY TO DO IT: Custom method on items contract
  tx = await items.addHandItemAssets(
    C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
    C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
    `${C.BASE_IPFS_URI}/items/flag/left.json`, // Asset for left hand
    `${C.BASE_IPFS_URI}/items/flag/right.json`, // Asset for left hand
  );
  await tx.wait();
  tx = await items.addHandItemAssets(
    C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
    C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
    `${C.BASE_IPFS_URI}/items/pencil/left.json`, // Asset for left hand
    `${C.BASE_IPFS_URI}/items/pencil/right.json`, // Asset for left hand
  );
  await tx.wait();
  tx = await items.addHandItemAssets(
    C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
    C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
    `${C.BASE_IPFS_URI}/items/spear/left.json`, // Asset for left hand
    `${C.BASE_IPFS_URI}/items/spear/right.json`, // Asset for left hand
  );
  await tx.wait();

  // WARNING: This is necessary to show the intention of groups of assets to be equipped into specific collection and slots. This is the reason we have equippable group ids.
  await items.setValidParentForEquippableGroup(
    C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
    chunkiesAddress,
    C.CHUNKY_LEFT_HAND_SLOT_PART_ID,
  );
  await items.setValidParentForEquippableGroup(
    C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
    chunkiesAddress,
    C.CHUNKY_RIGHT_HAND_SLOT_PART_ID,
  );
}

async function mintItems(items: ChunkyItem, chunkiesAddress: string) {
  // By the order we minted assets, we can know that these are the ids. We could have custom methods to assets to names or to set the asset ids ourselves but since only the issuer can add assets, we can trust the order.
  const boneLeftAssetId = 1;
  const boneRightAssetId = 2;
  const flagLeftAssetId = 3;
  const flagRightAssetId = 4;
  const pencilLeftAssetId = 5;
  const pencilRightAssetId = 6;
  const spearLeftAssetId = 7;
  const spearRightAssetId = 8;

  const [deployer] = await ethers.getSigners();

  // 1st WAY TO DO IT: Step by step
  // We will send a bone NFT to the first chunky, with 2 assets, one for each hand
  // We are using left hand asset as tokenURI. This is the simplest path. Alternatively, we could have used a custom implementation which does not require tokenURI on mint, but gets it from the the asset with the highest priority. This can easily be created on wizard.rmrk.dev
  // We first mint it to ourselves so we can accept both assets. The implementation we are using accepts the first ever asset or any asset added by the token owner, so both will be auto accepted
  let tx = await items.mint(deployer.address, 1, `${C.BASE_IPFS_URI}/items/bone/left.json`);
  await tx.wait();
  const newTokenId = await items.totalSupply();
  tx = await items.addAssetToToken(newTokenId, boneLeftAssetId, 0);
  await tx.wait();
  tx = await items.addAssetToToken(newTokenId, boneRightAssetId, 0);
  await tx.wait();
  tx = await items.nestTransferFrom(deployer.address, chunkiesAddress, newTokenId, 1, []);
  await tx.wait();

  // 2nd WAY TO DO IT: Custom method on items contract
  // Sending a flag NFT to the second chunky, with 2 assets, one for each hand
  tx = await items.nestMintWithAssets(
    chunkiesAddress, // To
    2, // destinationId
    `${C.BASE_IPFS_URI}/items/flag/left.json`, // TokenURI,
    [flagLeftAssetId, flagRightAssetId], // Assets
  );
  await tx.wait();
  // Sending a pencil NFT to the third chunky, with 2 assets, one for each hand
  tx = await items.nestMintWithAssets(
    chunkiesAddress, // To
    3, // destinationId
    `${C.BASE_IPFS_URI}/items/pencil/left.json`, // TokenURI,
    [pencilLeftAssetId, pencilRightAssetId], // Assets
  );
  await tx.wait();
  // Sending a spear NFT to the fourth chunky, with 2 assets, one for each hand
  tx = await items.nestMintWithAssets(
    chunkiesAddress, // To
    4, // destinationId
    `${C.BASE_IPFS_URI}/items/spear/left.json`, // TokenURI,
    [spearLeftAssetId, spearRightAssetId], // Assets
  );
  await tx.wait();
  // Sending a spear NFT to the fifth chunky, with 2 assets, one for each hand
  tx = await items.nestMintWithAssets(
    chunkiesAddress, // To
    5, // destinationId
    `${C.BASE_IPFS_URI}/items/spear/left.json`, // TokenURI,
    [spearLeftAssetId, spearRightAssetId], // Assets
  );
  await tx.wait();
  // Sending a flag NFT to the first chunky, with 2 assets, one for each hand
  tx = await items.nestMintWithAssets(
    chunkiesAddress, // To
    1, // destinationId
    `${C.BASE_IPFS_URI}/items/flag/left.json`, // TokenURI,
    [flagLeftAssetId, flagRightAssetId], // Assets
  );
  await tx.wait();
}

export { deployContracts, configureCatalog, mintChunkies, addItemAssets, mintItems };

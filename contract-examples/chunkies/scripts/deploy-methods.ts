import { ethers, run, network } from 'hardhat';
import {
  Chunkies,
  ChunkyItems,
  RMRKCatalogImpl,
  RMRKBulkWriter,
  RMRKCatalogUtils,
  RMRKCollectionUtils,
  RMRKEquipRenderUtils,
} from '../typechain-types';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';
import * as C from './constants';

// Add your deploy methods here:

export async function deployChunkies(): Promise<Chunkies> {
  console.log(`Deploying Chunkies to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('Chunkies');
  const args = [
    'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/chunkies/collection.json',
    100n,
    (await ethers.getSigners())[0].address,
    300,
  ] as const;

  const contract: Chunkies = await contractFactory.deploy(...args);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`Chunkies deployed to ${contractAddress}.`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    delay(10000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/Chunkies.sol:Chunkies',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }
  return contract;
}

export async function deployChunkyItems(): Promise<ChunkyItems> {
  console.log(`Deploying ChunkyItems to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('ChunkyItems');
  const args = [
    'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/items/collection.json',
    100n,
    (await ethers.getSigners())[0].address,
    300,
  ] as const;

  const contract: ChunkyItems = await contractFactory.deploy(...args);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`ChunkyItems deployed to ${contractAddress}.`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    delay(10000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/ChunkyItems.sol:ChunkyItems',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }
  return contract;
}

export async function configureCatalog(catalog: RMRKCatalogImpl, itemsAddress: string) {
  let tx = await catalog.addPartList([
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
  await tx.wait();
}

export async function mintChunkies(chunkies: Chunkies, catalogAddress: string, mintTo: string) {
  let tx = await chunkies.mintWithEquippableAsset(
    mintTo,
    `${C.BASE_IPFS_URI}/chunkies/full/1.json`, // TokenURI
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
  tx = await chunkies.mintWithEquippableAsset(
    mintTo, // To
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
    mintTo, // To
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
    mintTo, // To
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
    mintTo, // To
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

export async function addItemAssets(items: ChunkyItems, chunkiesAddress: string) {
  let tx = await items.addHandItemAssets(
    C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
    C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
    `${C.BASE_IPFS_URI}/items/bone/left.json`, // Asset for left hand
    `${C.BASE_IPFS_URI}/items/bone/right.json`, // Asset for left hand
  );

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

export async function mintItems(items: ChunkyItems, chunkiesAddress: string) {
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

  // We are using left hand asset as tokenURI. This is the simplest path. Alternatively, we could have used a custom implementation which does not require tokenURI on mint, but gets it from the the asset with the highest priority or the first asset. Both options can easily be created on wizard.rmrk.dev

  // Sending a bone NFT to the first chunky, with 2 assets, one for each hand
  let tx = await items.nestMintWithAssets(
    chunkiesAddress, // To
    1, // destinationId
    `${C.BASE_IPFS_URI}/items/bone/left.json`, // TokenURI,
    [boneLeftAssetId, boneRightAssetId], // Assets
  );

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

export async function deployBulkWriter(): Promise<RMRKBulkWriter> {
  const bulkWriterFactory = await ethers.getContractFactory('RMRKBulkWriter');
  const bulkWriter = await bulkWriterFactory.deploy();
  await bulkWriter.waitForDeployment();
  const bulkWriterAddress = await bulkWriter.getAddress();
  console.log('Bulk Writer deployed to:', bulkWriterAddress);

  await verifyIfNotHardhat(bulkWriterAddress);
  return bulkWriter;
}

export async function deployCatalogUtils(): Promise<RMRKCatalogUtils> {
  const catalogUtilsFactory = await ethers.getContractFactory('RMRKCatalogUtils');
  const catalogUtils = await catalogUtilsFactory.deploy();
  await catalogUtils.waitForDeployment();
  const catalogUtilsAddress = await catalogUtils.getAddress();
  console.log('Catalog Utils deployed to:', catalogUtilsAddress);

  await verifyIfNotHardhat(catalogUtilsAddress);
  return catalogUtils;
}

export async function deployCollectionUtils(): Promise<RMRKCollectionUtils> {
  const collectionUtilsFactory = await ethers.getContractFactory('RMRKCollectionUtils');
  const collectionUtils = await collectionUtilsFactory.deploy();
  await collectionUtils.waitForDeployment();
  const collectionUtilsAddress = await collectionUtils.getAddress();
  console.log('Collection Utils deployed to:', collectionUtilsAddress);

  await verifyIfNotHardhat(collectionUtilsAddress);
  return collectionUtils;
}

export async function deployRenderUtils(): Promise<RMRKEquipRenderUtils> {
  const renderUtilsFactory = await ethers.getContractFactory('RMRKEquipRenderUtils');
  const renderUtils = await renderUtilsFactory.deploy();
  await renderUtils.waitForDeployment();
  const renderUtilsAddress = await renderUtils.getAddress();
  console.log('Equip Render Utils deployed to:', renderUtilsAddress);

  await verifyIfNotHardhat(renderUtilsAddress);
  return renderUtils;
}

export async function deployCatalog(
  catalogMetadataUri: string,
  catalogType: string,
): Promise<RMRKCatalogImpl> {
  const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalog = await catalogFactory.deploy(catalogMetadataUri, catalogType);
  await catalog.waitForDeployment();
  const catalogAddress = await catalog.getAddress();
  console.log('Catalog deployed to:', catalogAddress);

  await verifyIfNotHardhat(catalogAddress, [catalogMetadataUri, catalogType]);
  return catalog;
}

async function verifyIfNotHardhat(contractAddress: string, args: any[] = []) {
  if (isHardhatNetwork()) {
    // Hardhat
    return;
  }

  // sleep 10s
  delay(10000);

  console.log('Etherscan contract verification starting now.');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    // probably already verified
  }
}

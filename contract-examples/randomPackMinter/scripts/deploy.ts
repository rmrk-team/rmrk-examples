import { ethers, network, run } from 'hardhat';
import { RandomPackMinter, Child, Parent, RMRKCatalogImpl } from '../typechain-types';
import * as C from './constants';
import { IRMRKCatalog } from '../typechain-types/@rmrk-team/evm-contracts/contracts/implementations/RMRKCatalogImpl';

async function deployContracts(): Promise<{
  parent: Parent;
  backgrounds: Child;
  glasses: Child;
  hands: Child;
  hats: Child;
  shirts: Child;
  catalog: RMRKCatalogImpl;
  minter: RandomPackMinter;
}> {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  const beneficiary = C.BENEFICIARY === '' ? deployer.address : C.BENEFICIARY;

  const parentFactory = await ethers.getContractFactory('Parent');
  const parentArgs = [
    C.PARENT_COLLECTION_NAME,
    C.PARENT_COLLECTION_SYMBOL,
    C.PARENT_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    beneficiary,
    C.ROYALTIES_BPS,
  ] as const;

  const parent: Parent = await parentFactory.deploy(...parentArgs);
  await parent.deployed();

  const childFactory = await ethers.getContractFactory('Child');
  const backgroundArgs = [
    C.BACKGROUNDS_COLLECTION_NAME,
    C.BACKGROUNDS_COLLECTION_SYMBOL,
    C.BACKGROUNDS_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    beneficiary,
    C.ROYALTIES_BPS,
  ] as const;
  const glassesArgs = [
    C.GLASSES_COLLECTION_NAME,
    C.GLASSES_COLLECTION_SYMBOL,
    C.GLASSES_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    beneficiary,
    C.ROYALTIES_BPS,
  ] as const;
  const handsArgs = [
    C.HANDS_COLLECTION_NAME,
    C.HANDS_COLLECTION_SYMBOL,
    C.HANDS_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    beneficiary,
    C.ROYALTIES_BPS,
  ] as const;
  const hatsArgs = [
    C.HATS_COLLECTION_NAME,
    C.HATS_COLLECTION_SYMBOL,
    C.HATS_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    beneficiary,
    C.ROYALTIES_BPS,
  ] as const;
  const shirtsArgs = [
    C.SHIRTS_COLLECTION_NAME,
    C.SHIRTS_COLLECTION_SYMBOL,
    C.SHIRTS_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    beneficiary,
    C.ROYALTIES_BPS,
  ] as const;

  const backgrounds: Child = await childFactory.deploy(...backgroundArgs);
  await backgrounds.deployed();

  const glasses: Child = await childFactory.deploy(...glassesArgs);
  await glasses.deployed();

  const hands: Child = await childFactory.deploy(...handsArgs);
  await hands.deployed();

  const hats: Child = await childFactory.deploy(...hatsArgs);
  await hats.deployed();

  const shirts: Child = await childFactory.deploy(...shirtsArgs);
  await shirts.deployed();

  const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalogArgs = [C.CATALOG_METADATA_URI, C.CATALOG_TYPE] as const;
  const catalog: RMRKCatalogImpl = await catalogFactory.deploy(...catalogArgs);
  await catalog.deployed();

  const minterFactory = await ethers.getContractFactory('RandomPackMinter');
  const minterArgs = [
    beneficiary,
    parent.address,
    backgrounds.address,
    glasses.address,
    hands.address,
    hats.address,
    shirts.address,
    C.MINT_PRICE,
  ] as const;
  const minter: RandomPackMinter = await minterFactory.deploy(...minterArgs);
  await minter.deployed();

  let tx = await minter.setAssetOdds(
    C.PARENT_ASSETS_ODDS,
    C.BACKGROUNDS_ASSETS_ODDS,
    C.GLASSES_ASSETS_ODDS,
    C.HANDS_ASSETS_ODDS,
    C.HATS_ASSETS_ODDS,
    C.SHIRTS_ASSETS_ODDS,
  );
  await tx.wait();

  if (network.name !== 'hardhat') {
    // Delay 20s
    await new Promise((r) => setTimeout(r, 20000));

    await run('verify:verify', {
      address: parent.address,
      constructorArguments: parentArgs,
    });
    await run('verify:verify', {
      address: backgrounds.address,
      constructorArguments: backgroundArgs,
    }); // Other items will be verified by this automatically
    await run('verify:verify', {
      address: minter.address,
      constructorArguments: minterArgs,
    });
    await run('verify:verify', {
      address: catalog.address,
      constructorArguments: catalogArgs,
    });
  }

  return {
    parent,
    backgrounds,
    glasses,
    hands,
    hats,
    shirts,
    minter,
    catalog,
  };
}

async function configureRelationships(
  parent: Parent,
  backgrounds: Child,
  glasses: Child,
  hands: Child,
  hats: Child,
  shirts: Child,
  minter: RandomPackMinter,
) {
  let tx = await parent.setMinter(minter.address);
  await tx.wait();
  tx = await backgrounds.setMinter(minter.address);
  await tx.wait();
  tx = await glasses.setMinter(minter.address);
  await tx.wait();
  tx = await hands.setMinter(minter.address);
  await tx.wait();
  tx = await hats.setMinter(minter.address);
  await tx.wait();
  tx = await shirts.setMinter(minter.address);
  await tx.wait();
  console.log('Mintor set in all collections');

  tx = await parent.setAutoAcceptCollection(backgrounds.address, true);
  await tx.wait();
  tx = await parent.setAutoAcceptCollection(glasses.address, true);
  await tx.wait();
  tx = await parent.setAutoAcceptCollection(hands.address, true);
  await tx.wait();
  tx = await parent.setAutoAcceptCollection(hats.address, true);
  await tx.wait();
  tx = await parent.setAutoAcceptCollection(shirts.address, true);
  await tx.wait();
  console.log('All item collections set to auto accept on parent');

  tx = await backgrounds.setValidParentForEquippableGroup(
    C.BACKGROUNDS_SLOT_ID,
    parent.address,
    C.BACKGROUNDS_SLOT_ID,
  );
  await tx.wait();
  tx = await glasses.setValidParentForEquippableGroup(
    C.GLASSES_SLOT_ID,
    parent.address,
    C.GLASSES_SLOT_ID,
  );
  await tx.wait();
  tx = await hands.setValidParentForEquippableGroup(
    C.HANDS_SLOT_ID,
    parent.address,
    C.HANDS_SLOT_ID,
  );
  await tx.wait();
  tx = await hats.setValidParentForEquippableGroup(C.HATS_SLOT_ID, parent.address, C.HATS_SLOT_ID);
  await tx.wait();
  tx = await shirts.setValidParentForEquippableGroup(
    C.SHIRTS_SLOT_ID,
    parent.address,
    C.SHIRTS_SLOT_ID,
  );
  await tx.wait();
  console.log('All item collections configured slot to be equippable into parent');
}

async function addAssets(
  parent: Parent,
  backgrounds: Child,
  glasses: Child,
  hands: Child,
  hats: Child,
  shirts: Child,
  catalog: RMRKCatalogImpl,
) {
  // On parent this method is very different, see docstirng
  let tx = await parent.batchAddAssets(
    C.PARENT_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.PARENT_TOTAL_ASSETS,
    C.PARENT_EQUIPPABLE_GROUP_ID,
    catalog.address,
    [C.BACKGROUNDS_SLOT_ID, C.GLASSES_SLOT_ID, C.HANDS_SLOT_ID, C.HATS_SLOT_ID, C.SHIRTS_SLOT_ID],
  );
  await tx.wait();

  tx = await backgrounds.batchAddAssets(
    C.BACKGROUNDS_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.BACKGROUNDS_TOTAL_ASSETS,
    C.BACKGROUNDS_SLOT_ID,
  );
  await tx.wait();

  tx = await glasses.batchAddAssets(
    C.GLASSES_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.GLASSES_TOTAL_ASSETS,
    C.GLASSES_SLOT_ID,
  );
  await tx.wait();

  tx = await hands.batchAddAssets(
    C.HANDS_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.HANDS_TOTAL_ASSETS,
    C.HANDS_SLOT_ID,
  );
  await tx.wait();

  tx = await hats.batchAddAssets(
    C.HATS_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.HATS_TOTAL_ASSETS,
    C.HATS_SLOT_ID,
  );
  await tx.wait();

  tx = await shirts.batchAddAssets(
    C.SHIRTS_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.SHIRTS_TOTAL_ASSETS,
    C.SHIRTS_SLOT_ID,
  );
  await tx.wait();
}

async function configureCatalog(
  backgrounds: Child,
  glasses: Child,
  hands: Child,
  hats: Child,
  shirts: Child,
  catalog: RMRKCatalogImpl,
) {
  const parentParts: IRMRKCatalog.IntakeStructStruct[] = [];
  for (let i = 1; i <= C.PARENT_TOTAL_ASSETS; i++) {
    parentParts.push({
      partId: i,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.BODY_Z_INDEX,
        equippable: [],
        metadataURI: `${C.PARENT_ASSETS_BASE_URI}${i}.json`,
      },
    });
  }
  let tx = await catalog.addPartList(parentParts);

  tx = await catalog.addPartList([
    {
      partId: C.BACKGROUNDS_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.BACKGROUNDS_Z_INDEX,
        equippable: [backgrounds.address],
        metadataURI: C.BACKGROUNDS_SLOT_METADATA,
      },
    },
    {
      partId: C.GLASSES_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.GLASSES_Z_INDEX,
        equippable: [glasses.address],
        metadataURI: C.GLASSES_SLOT_METADATA,
      },
    },
    {
      partId: C.HANDS_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.HANDS_Z_INDEX,
        equippable: [hands.address],
        metadataURI: C.HANDS_SLOT_METADATA,
      },
    },
    {
      partId: C.HATS_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.HATS_Z_INDEX,
        equippable: [hats.address],
        metadataURI: C.HATS_SLOT_METADATA,
      },
    },
    {
      partId: C.SHIRTS_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.SHIRTS_Z_INDEX,
        equippable: [shirts.address],
        metadataURI: C.SHIRTS_SLOT_METADATA,
      },
    },
  ]);
  await tx.wait();
}

export { deployContracts, configureRelationships, addAssets, configureCatalog };

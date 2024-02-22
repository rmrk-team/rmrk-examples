import { ethers, run, network } from 'hardhat';
import { delay, isHardhatNetwork } from './utils';
import {
  Army,
  Kingdom,
  RMRKBulkWriter,
  RMRKCatalogImpl,
  RMRKCatalogUtils,
  RMRKCollectionUtils,
  RMRKEquipRenderUtils,
  Soldier,
} from '../typechain-types';
import { getRegistry } from './get-gegistry';

export async function deploySoldier(): Promise<Soldier> {
  console.log(`Deploying Soldier to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('Soldier');
  const args = [
    'ipfs://QmQhDyuSvd49pxe5v2KnmvWT39TFyoqEQyBkhjYC7imHUs/soldiers/collection.json',
    1000n,
    (await ethers.getSigners())[0].address,
    300,
  ] as const;

  const contract: Soldier = await contractFactory.deploy(...args);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`Soldier deployed to ${contractAddress}.`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(10000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/Soldier.sol:Soldier',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }
  return contract;
}

export async function deployArmy(): Promise<Army> {
  console.log(`Deploying Army to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('Army');
  const args = [
    'ipfs://Qma8tB38iAiqFAJpwz55d7sRQx4q7zZq1gzXkkK9wjehCg/collection.json',
    1000n,
    (await ethers.getSigners())[0].address,
    300,
  ] as const;

  const contract: Army = await contractFactory.deploy(...args);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`Army deployed to ${contractAddress}.`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(10000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/Army.sol:Army',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }
  return contract;
}

export async function deployKingdom(): Promise<Kingdom> {
  console.log(`Deploying Kingdom to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('Kingdom');
  const args = [
    'ipfs://QmQhDyuSvd49pxe5v2KnmvWT39TFyoqEQyBkhjYC7imHUs/kingdom/collection.json',
    1000n,
    (await ethers.getSigners())[0].address,
    300,
  ] as const;

  const contract: Kingdom = await contractFactory.deploy(...args);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`Kingdom deployed to ${contractAddress}.`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(10000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/Kingdom.sol:Kingdom',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }
  return contract;
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

  // sleep 20s
  await delay(20000);

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

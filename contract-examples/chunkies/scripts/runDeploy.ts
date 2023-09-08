import { ethers, network } from 'hardhat';
import { getRegistry } from './getRegistry';
import * as C from './constants';
import { addItemAssets, configureCatalog, deployContracts, mintChunkies, mintItems } from './utils';

async function main() {
  console.log(`Deploying Chunkies to ${network.name} blockchain...`);
  const [deployer] = await ethers.getSigners();

  const { chunkies, items, catalog } = await deployContracts();

  console.log(`Chunky deployed to ${chunkies.address}`);
  console.log(`ChunkyItem deployed to ${items.address}`);
  console.log(`ChunkyCatalog deployed to ${catalog.address}`);

  const registry = await getRegistry();
  await registry.addExternalCollection(chunkies.address, C.CHUNKY_METADATA);
  await registry.addExternalCollection(items.address, C.CHUNKY_ITEM_METADATA);
  console.log('Collections added to Singular Registry');

  await configureCatalog(catalog, items.address);
  console.log('Catalog configured');

  // Each chunky has a unique asset, so we add assets and mint in the same method
  await mintChunkies(chunkies, catalog.address, deployer);
  console.log('Chunkies minted');

  // So holders do not need to accept each item
  await chunkies.setAutoAcceptCollection(items.address);

  // Items reuse assets, we only need to add them once
  await addItemAssets(items, chunkies.address);
  console.log('Item assets added');

  await mintItems(items, chunkies.address);
  console.log('Items minted');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

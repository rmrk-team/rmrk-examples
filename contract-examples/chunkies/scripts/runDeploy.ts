import { network } from 'hardhat';
import { getRegistry } from './getRegistry';
import * as C from './constants'
import { 
  deployContracts,
  configureCatalog,
  mintChunkies,
  mintItems,
 } from './utils';


async function main() {
  console.log(`Deploying Chunkies to ${network.name} blockchain...`);

  const {chunkies, items, catalog} = await deployContracts();

  console.log(`Chunky deployed to ${chunkies.address}`);
  console.log(`ChunkyItem deployed to ${items.address}`);
  console.log(`ChunkyCatalog deployed to ${catalog.address}`);

  const registry = await getRegistry();
  await registry.addExternalCollection(chunkies.address, C.CHUNKY_METADATA);
  await registry.addExternalCollection(items.address, C.CHUNKY_ITEM_METADATA);
  console.log('Collections added to Singular Registry');

  await configureCatalog(catalog, items.address);
  console.log('Catalog configured');

  await mintChunkies(chunkies, catalog.address);
  console.log('Chunkies minted');

  await mintItems(items);
  console.log('Items minted');
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

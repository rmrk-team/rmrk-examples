import { ethers } from 'hardhat';
import getDeployedContracts from './get-deployed-contracts';
import { configureCatalog, mintChunkies, addItemAssets, mintItems } from './deploy-methods';

async function main() {
  const { chunkies, chunkyItems, catalog } = await getDeployedContracts();
  const [deployer] = await ethers.getSigners();

  let tx = await chunkies.setAutoAcceptCollection(await chunkyItems.getAddress(), true);
  await tx.wait();
  console.log('Chunkies set to auto accept ChunkyItems');

  await configureCatalog(catalog, await chunkyItems.getAddress());
  console.log('Catalog configured');

  await mintChunkies(chunkies, await catalog.getAddress(), deployer.address);
  console.log(`Chunkies minted to ${deployer.address}`);

  await addItemAssets(chunkyItems, await chunkies.getAddress());
  console.log('Item assets added');

  await mintItems(chunkyItems, await chunkies.getAddress());
  console.log('Items minted into chunkies');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

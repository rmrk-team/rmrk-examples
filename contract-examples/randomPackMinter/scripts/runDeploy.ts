import { getRegistry } from './getRegistry';
import { deployContracts, configureRelationships, addAssets, configureCatalog } from './deploy';
import * as C from './constants';
import { ethers, network } from 'hardhat';

async function main() {
  console.log('Deploying All collections, catalog and minter ');

  const [deployer] = await ethers.getSigners();
  const { parent, backgrounds, glasses, hands, hats, shirts, minter, catalog } =
    await deployContracts();

  console.log(`Parent: ${await parent.getAddress()}`);
  console.log(`Backgrounds: ${await backgrounds.getAddress()}`);
  console.log(`Glasses: ${await glasses.getAddress()}`);
  console.log(`Hands: ${await hands.getAddress()}`);
  console.log(`Hats: ${await hats.getAddress()}`);
  console.log(`Shirts: ${await shirts.getAddress()}`);
  console.log(`RandomPackMinter: ${await minter.getAddress()}`);

  // Only do on testing, or if whitelisted for production
  if (network.name !== 'hardhat') {
    const registry = await getRegistry();
    let tx = await registry.addExternalCollection(
      await parent.getAddress(),
      C.PARENT_COLLECTION_METADATA,
    );
    await tx.wait();
    tx = await registry.addExternalCollection(
      await backgrounds.getAddress(),
      C.BACKGROUNDS_COLLECTION_METADATA,
    );
    await tx.wait();
    tx = await registry.addExternalCollection(
      await glasses.getAddress(),
      C.GLASSES_COLLECTION_METADATA,
    );
    await tx.wait();
    tx = await registry.addExternalCollection(
      await hands.getAddress(),
      C.HANDS_COLLECTION_METADATA,
    );
    await tx.wait();
    tx = await registry.addExternalCollection(await hats.getAddress(), C.HATS_COLLECTION_METADATA);
    await tx.wait();
    tx = await registry.addExternalCollection(
      await shirts.getAddress(),
      C.SHIRTS_COLLECTION_METADATA,
    );
    await tx.wait();
    console.log('Collections added to registry');
  }

  await configureCatalog(backgrounds, glasses, hands, hats, shirts, catalog);
  console.log('Catalog configured');

  await configureRelationships(parent, backgrounds, glasses, hands, hats, shirts, minter);
  console.log('Relationships configured');

  await addAssets(parent, backgrounds, glasses, hands, hats, shirts, catalog);
  console.log('Assets added');

  const gasEstimation = await minter.mintPacks.estimateGas(await deployer.getAddress(), 1, {
    value: ethers.parseEther('0.1'),
  });
  const maxGas = (gasEstimation * 110n) / 100n;
  let t = await minter.mintPacks(await deployer.getAddress(), 1, {
    value: ethers.parseEther('0.1'),
    gasLimit: maxGas,
  });
  await t.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

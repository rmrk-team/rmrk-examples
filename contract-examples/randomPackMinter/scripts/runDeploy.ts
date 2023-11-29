import { getRegistry } from './getRegistry';
import { deployContracts, configureRelationships, addAssets, configureCatalog } from './deploy';
import * as C from './constants';
import { ethers, network } from 'hardhat';

async function main() {
  console.log('Deploying All collections, catalog and minter ');

  const [deployer] = await ethers.getSigners();
  const { parent, backgrounds, glasses, hands, hats, shirts, minter, catalog } =
    await deployContracts();

  console.log(`Parent: ${parent.address}`);
  console.log(`Backgrounds: ${backgrounds.address}`);
  console.log(`Glasses: ${glasses.address}`);
  console.log(`Hands: ${hands.address}`);
  console.log(`Hats: ${hats.address}`);
  console.log(`Shirts: ${shirts.address}`);
  console.log(`RandomPackMinter: ${minter.address}`);

  // Only do on testing, or if whitelisted for production
  if (network.name !== 'hardhat') {
    const registry = await getRegistry();
    let tx = await registry.addExternalCollection(parent.address, C.PARENT_COLLECTION_METADATA);
    await tx.wait();
    tx = await registry.addExternalCollection(
      backgrounds.address,
      C.BACKGROUNDS_COLLECTION_METADATA,
    );
    await tx.wait();
    tx = await registry.addExternalCollection(glasses.address, C.GLASSES_COLLECTION_METADATA);
    await tx.wait();
    tx = await registry.addExternalCollection(hands.address, C.HANDS_COLLECTION_METADATA);
    await tx.wait();
    tx = await registry.addExternalCollection(hats.address, C.HATS_COLLECTION_METADATA);
    await tx.wait();
    tx = await registry.addExternalCollection(shirts.address, C.SHIRTS_COLLECTION_METADATA);
    await tx.wait();
    console.log('Collections added to registry');
  }

  await configureCatalog(backgrounds, glasses, hands, hats, shirts, catalog);
  console.log('Catalog configured');

  await configureRelationships(parent, backgrounds, glasses, hands, hats, shirts, minter);
  console.log('Relationships configured');

  await addAssets(parent, backgrounds, glasses, hands, hats, shirts, catalog);
  console.log('Assets added');

  const gasEstimation = await minter.estimateGas.mintPacks(deployer.address, 1, {
    value: ethers.utils.parseEther('0.1'),
  });
  const maxGas = gasEstimation.mul(110).div(100);
  let t = await minter.mintPacks(deployer.address, 1, {
    value: ethers.utils.parseEther('0.1'),
    gasLimit: maxGas,
  });
  await t.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

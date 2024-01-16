import { ethers, run, network } from 'hardhat';
import { Army } from '../typechain-types';
import { getRegistry } from './getRegistry';

async function main() {
  await deployContracts();
}

export default async function deployContracts(): Promise<Army> {
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
  console.log(`Army deployed to ${await contract.getAddress()}.`);

  if ((await ethers.provider.getNetwork()).name !== 'hardhat') {
    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(await contract.getAddress(), args[0]);
    console.log('Collection added to Singular Registry');

    console.log('Waiting 10 seconds before verifying contract...');
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await run('verify:verify', {
      address: await contract.getAddress(),
      constructorArguments: args,
      contract: 'contracts/Army.sol:Army',
    });
  }
  return contract;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

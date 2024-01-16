import { ethers, run, network } from 'hardhat';
import { Kingdom } from '../typechain-types';
import { getRegistry } from './getRegistry';

async function main() {
  await deployContracts();
}

export default async function deployContracts(): Promise<Kingdom> {
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
  console.log(`Kingdom deployed to ${await contract.getAddress()}.`);

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
      contract: 'contracts/Kingdom.sol:Kingdom',
    });
  }
  return contract;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

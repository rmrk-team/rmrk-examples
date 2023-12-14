import { ethers, run, network } from 'hardhat';
import { BigNumber } from 'ethers';
import { Army } from '../typechain-types';
import { getRegistry } from './getRegistry';


async function main() {
  await deployContracts();
}

async function deployContracts(): Promise<void> {
  console.log(`Deploying Army to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory("Army");
  const args = [
    "ipfs://Qma8tB38iAiqFAJpwz55d7sRQx4q7zZq1gzXkkK9wjehCg/collection.json",
    BigNumber.from(1000),
    (await ethers.getSigners())[0].address,
    300,
  ] as const;
  
  const contract: Army = await contractFactory.deploy(...args);
  await contract.deployed();
  console.log(`Army deployed to ${contract.address}.`);

  // Only do on testing, or if whitelisted for production
  const registry = await getRegistry();
  await registry.addExternalCollection(contract.address, args[0]);
  console.log('Collection added to Singular Registry');

  const chainId = (await ethers.provider.getNetwork()).chainId;
  if (chainId === 31337) {
    console.log('Skipping verify on local chain');
    return;
  }

  await run('verify:verify', {
    address: contract.address,
    constructorArguments: args,
    contract: 'contracts/Army.sol:Army',
  });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers, run, network } from 'hardhat';
import { BigNumber } from 'ethers';
import { Soldier } from '../typechain-types';
import { getRegistry } from './getRegistry';


async function main() {
  await deployContracts();
}

async function deployContracts(): Promise<void> {
  console.log(`Deploying Soldier to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory("Soldier");
  const args = [
    "ipfs://QmQhDyuSvd49pxe5v2KnmvWT39TFyoqEQyBkhjYC7imHUs/soldiers/collection.json",
    BigNumber.from(1000),
    (await ethers.getSigners())[0].address,
    300,
  ] as const;
  
  const contract: Soldier = await contractFactory.deploy(...args);
  await contract.deployed();
  console.log(`Soldier deployed to ${contract.address}.`);

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
    contract: 'contracts/Soldier.sol:Soldier',
  });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

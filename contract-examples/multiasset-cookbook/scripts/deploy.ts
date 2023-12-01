import { ethers, run, network } from 'hardhat';
import { BigNumber } from 'ethers';
import { CookBook } from '../typechain-types';
import { getRegistry } from './getRegistry';

async function main() {
  await deployContracts();
}

async function deployContracts(): Promise<void> {
  console.log(`Deploying CookBook to ${network.name} blockchain...`);
  const [master] = await ethers.getSigners();
  console.log(`Deploying contracts with master account: ${master.address}`);

  const contractFactory = await ethers.getContractFactory('CookBook');
  const args = [
    'ipfs://QmSU2R1ewXA7vmxD17KQTLRG1nu63KPxDmnb6xdtZ2Hmq5',
    BigNumber.from(100),
    (await ethers.getSigners())[0].address,
    500,
  ] as const;

  const contract: CookBook = await contractFactory.deploy(...args);
  await contract.deployed();
  console.log(`CookBook deployed to ${contract.address}.`);

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
    contract: 'contracts/CookBook.sol:CookBook',
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers, run, network } from 'hardhat';
import { CookBook } from '../typechain-types';
import { getRegistry } from './getRegistry';

async function main() {
  await deployContracts();
}

export default async function deployContracts(): Promise<CookBook> {
  console.log(`Deploying CookBook to ${network.name} blockchain...`);
  const [master] = await ethers.getSigners();
  console.log(`Deploying contracts with master account: ${master.address}`);

  const contractFactory = await ethers.getContractFactory('CookBook');
  const args = [
    'ipfs://QmSU2R1ewXA7vmxD17KQTLRG1nu63KPxDmnb6xdtZ2Hmq5',
    100n,
    (await ethers.getSigners())[0].address,
    500,
  ] as const;

  const contract: CookBook = await contractFactory.deploy(...args);
  await contract.waitForDeployment();
  console.log(`CookBook deployed to ${await contract.getAddress()}.`);

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
      contract: 'contracts/CookBook.sol:CookBook',
    });
  }
  return contract;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

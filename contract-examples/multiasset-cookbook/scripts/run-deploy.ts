import { ethers, run, network } from 'hardhat';
import { CookBook } from '../typechain-types';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';

async function main() {
  await deployCookBook();
}

async function deployCookBook(): Promise<CookBook> {
  console.log(`Deploying CookBook to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory("CookBook");
  const args = [
    "Collection Metadata: ipfs://QmSU2R1ewXA7vmxD17KQTLRG1nu63KPxDmnb6xdtZ2Hmq5",
    100n,
    (await ethers.getSigners())[0].address,
    500,
  ] as const;
  
  const contract: CookBook = await contractFactory.deploy(...args);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`CookBook deployed to ${contractAddress}.`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...')
    await delay(10000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/CookBook.sol:CookBook',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }
  return contract;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

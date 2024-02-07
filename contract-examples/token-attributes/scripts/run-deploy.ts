import { ethers, run, network } from 'hardhat';
import { SimpleEquippable } from '../typechain-types';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';

async function main() {
  const collection = await deployContracts();
  await mint(collection);
}

async function deployContracts(): Promise<SimpleEquippable> {
  console.log(`Deploying SimpleEquippable to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('SimpleEquippable');
  const collectionMeta =
    'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/chunkies/collection.json';
  const maxSupply = 1000n;
  const royaltyRecipient = (await ethers.getSigners())[0].address;
  const royaltyPercentageBps = 300; // 3%

  if (collectionMeta === undefined || maxSupply === undefined) {
    throw new Error('Please set collectionMeta and maxSupply');
  } else {
    const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps] as const;
    const contract: SimpleEquippable = await contractFactory.deploy(...args);
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log(`SimpleEquippable deployed to ${contractAddress}`);

    if (!isHardhatNetwork()) {
      console.log('Waiting 20 seconds before verifying contract...');
      await delay(20000);
      await run('verify:verify', {
        address: contractAddress,
        constructorArguments: args,
        contract: 'contracts/SimpleEquippable.sol:SimpleEquippable',
      });
    }
    return contract;
  }
}

async function mint(collection: SimpleEquippable): Promise<void> {
  console.log(`Minting 5 tokens...`);
  const [signer] = await ethers.getSigners();
  await collection.connect(signer).mint(
    signer.address, // to
    5, // amount to mint
    'ipfs://QmadB7RnpfXSd2JX1e6HZLBKwSkBR3PiXhTmkN9dE5DKur/chunkies/full/1.json', // token URI
  );
  console.log(`Minted 5 tokens.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

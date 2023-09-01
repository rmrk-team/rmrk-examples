import { ethers, run } from 'hardhat';
import { BigNumber } from 'ethers';
import { Chunky, ChunkyItem, ChunkyCatalog } from '../typechain-types';
import * as C from './constants'

async function deployContracts(): Promise<{chunkies:Chunky, items: ChunkyItem, catalog: ChunkyCatalog}> {
  const deployerAddress = (await ethers.getSigners())[0].address;

  const chunkyFactory = await ethers.getContractFactory("Chunky");
  const itemFactory = await ethers.getContractFactory("ChunkyItem");
  const catalogFactory = await ethers.getContractFactory("ChunkyCatalog");

  const chunkyArgs = [
    C.CHUNKY_METADATA,
    BigNumber.from(100),
    deployerAddress,
    500, // 5%
  ] as const;

  const itemArgs = [
    C.CHUNKY_ITEM_METADATA,
    BigNumber.from(200),
    deployerAddress,
    500, // 5%
  ] as const;

  const catalogArgs = 
    [C.CHUNKY_CATALOG_METADATA, 'img'] as const;

  const chunkies: Chunky = await chunkyFactory.deploy(...chunkyArgs);
  await chunkies.deployed();
  
  const items: ChunkyItem = await itemFactory.deploy(...itemArgs);
  await items.deployed();
  
  const catalog: ChunkyCatalog = await catalogFactory.deploy(...catalogArgs);
  await catalog.deployed();

  const chainId = (await ethers.provider.getNetwork()).chainId;
  if (chainId !== 31337) { // Skip verification on local chain
    await run('verify:verify', {
      address: chunkies.address,
      constructorArguments: chunkyArgs,
    });
    await run('verify:verify', {
      address: items.address,
      constructorArguments: itemArgs,
    });
    await run('verify:verify', {
      address: catalog.address,
      constructorArguments: catalogArgs,
    });
  }

  return {chunkies, items, catalog};
}

async function configureCatalog(catalog: ChunkyCatalog, itemsAddress: string) {

}

async function mintChunkies(chunkies: Chunky, catalogAddress: string) {

}

async function mintItems(items: ChunkyItem) {
}



export {
  deployContracts,
  configureCatalog,
  mintChunkies,
  mintItems,

}
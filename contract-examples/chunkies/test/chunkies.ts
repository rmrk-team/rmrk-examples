import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { Chunky, ChunkyCatalog, ChunkyItem } from '../typechain-types';
import { addItemAssets, configureCatalog, deployContracts, mintChunkies, mintItems } from '../scripts/utils';


async function fixture(): Promise<{chunkies: Chunky, items: ChunkyItem, catalog: ChunkyCatalog}> {
  const [deployer] = await ethers.getSigners();

  const { chunkies, items, catalog } = await deployContracts();
  console.log('Contracts deployed');
  await configureCatalog(catalog, items.address);
  console.log('Catalog configured');
  await mintChunkies(chunkies, catalog.address, deployer);
  console.log('Chunkies minted');
  await addItemAssets(items, chunkies.address);
  console.log('Item assets added');
  await mintItems(items, chunkies.address);
  console.log('Items minted');

  return { chunkies, items, catalog };
}

describe('Chunkys', async () => {
  let chunkies: Chunky;
  let items: ChunkyItem;
  let catalog: ChunkyCatalog;
  beforeEach(async function () {
    ({ chunkies, items, catalog } = await loadFixture(fixture));
  });

  it('minted expected chunkies', async function () {
    console.log(await chunkies.tokenURI(1));
  });
});

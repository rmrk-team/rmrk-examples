import { ethers } from 'hardhat';
import { Chunkies, ChunkyItems, RMRKCatalogImpl } from '../typechain-types';
import { isHardhatNetwork } from './utils';

const CHUNKIES_ADDRESS_HARDHAT = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const CHUNKY_ITEMS_ADDRESS_HARDHAT = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const CATALOG_ADDRESS_HARDHAT = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

const CHUNKIES_ADDRESS_PROD = '';
const CHUNKY_ITEMS_ADDRESS_PROD = '';
const CATALOG_ADDRESS_PROD = '';

export default async function getDeployedContracts(): Promise<{
  chunkies: Chunkies;
  chunkyItems: ChunkyItems;
  catalog: RMRKCatalogImpl;
}> {
  const chunkiesAddress = isHardhatNetwork() ? CHUNKIES_ADDRESS_HARDHAT : CHUNKIES_ADDRESS_PROD;
  const chunkiesFactory = await ethers.getContractFactory('Chunkies');
  const chunkies = <Chunkies>chunkiesFactory.attach(chunkiesAddress);

  const chunkyItemsAddress = isHardhatNetwork()
    ? CHUNKY_ITEMS_ADDRESS_HARDHAT
    : CHUNKY_ITEMS_ADDRESS_PROD;
  const chunkyItemsFactory = await ethers.getContractFactory('ChunkyItems');
  const chunkyItems = <ChunkyItems>chunkyItemsFactory.attach(chunkyItemsAddress);

  const catalogAddress = isHardhatNetwork() ? CATALOG_ADDRESS_HARDHAT : CATALOG_ADDRESS_PROD;
  const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalog = <RMRKCatalogImpl>catalogFactory.attach(catalogAddress);

  return {
    chunkies,
    chunkyItems,
    catalog,
  };
}

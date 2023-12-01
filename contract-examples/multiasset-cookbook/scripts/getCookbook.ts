import { ethers } from 'hardhat';
import { CookBook } from '../typechain-types';

export async function getCookbook(): Promise<CookBook> {
  const cookbookAddress = '0x473b8FC2483c516AadB8d365027A8C2eB8700A39';
  const contractFactory = await ethers.getContractFactory('CookBook');
  return <CookBook>contractFactory.attach(cookbookAddress);
}

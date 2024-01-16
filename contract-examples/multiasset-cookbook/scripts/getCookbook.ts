import { ethers } from 'hardhat';
import { CookBook } from '../typechain-types';
import deployCookbook from './deploy';

export async function getCookbook(): Promise<CookBook> {
  let cookbook: CookBook;

  if ((await ethers.provider.getNetwork()).name === 'hardhat') {
    cookbook = await deployCookbook();
  } else {
    // REPLACE THE COOKBOOK ADDRESS FOR THE ONE YOU JUST DEPLOYED:
    const cookbookAddress = '0xB4d3b179ACA978A7C0D22dd9E3cA8D6872B204A4';
    const contractFactory = await ethers.getContractFactory('CookBook');
    cookbook = <CookBook>contractFactory.attach(cookbookAddress);
  }
  return cookbook;
}

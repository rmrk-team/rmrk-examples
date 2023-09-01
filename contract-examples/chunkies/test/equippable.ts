import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { Chunky } from '../typechain-types';
import { InitDataNativePay } from '../typechain-types/contracts/Chunky';

async function fixture(): Promise<Chunky> {
  const equipFactory = await ethers.getContractFactory('Chunky');

  const initData: InitDataNativePay.InitDataStruct = {
    royaltyRecipient: ethers.constants.AddressZero,
    royaltyPercentageBps: 1000,
    maxSupply: BigNumber.from(1000),
    pricePerMint: ethers.utils.parseEther('1.0'),
  };

  const equip: Chunky = await equipFactory.deploy(
    'Kanaria',
    'KAN',
    'ipfs://collectionMeta',
    'ipfs://tokenMeta',
    initData,
  );
  await equip.deployed();

  return equip;
}

describe('Chunky Assets', async () => {
  let equip: Chunky;
  beforeEach(async function () {
    equip = await loadFixture(fixture);
  });

  describe('Init', async function () {
    it('can get names and symbols', async function () {
      expect(await equip.name()).to.equal('Kanaria');
      expect(await equip.symbol()).to.equal('KAN');
    });
  });
});

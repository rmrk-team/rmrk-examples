import { ethers } from 'hardhat';
import { expect } from 'chai';
import { RandomPackMinter, Child, Parent, RMRKCatalogImpl } from '../typechain-types';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import {
  deployContracts,
  configureRelationships,
  addAssets,
  configureCatalog,
} from '../scripts/deploy';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

async function fixture(): Promise<{
  parent: Parent;
  backgrounds: Child;
  glasses: Child;
  hands: Child;
  hats: Child;
  shirts: Child;
  catalog: RMRKCatalogImpl;
  minter: RandomPackMinter;
}> {
  const { parent, backgrounds, glasses, hands, hats, shirts, minter, catalog } =
    await deployContracts();
  await configureCatalog(backgrounds, glasses, hands, hats, shirts, catalog);
  await configureRelationships(parent, backgrounds, glasses, hands, hats, shirts, minter);
  await addAssets(parent, backgrounds, glasses, hands, hats, shirts, catalog);

  return { parent, backgrounds, glasses, hands, hats, shirts, minter, catalog };
}

describe('RandomPackMinter', async () => {
  let parent: Parent;
  let backgrounds: Child;
  let glasses: Child;
  let hands: Child;
  let hats: Child;
  let shirts: Child;
  let catalog: RMRKCatalogImpl;
  let minter: RandomPackMinter;
  let deployer: SignerWithAddress;
  let buyer1: SignerWithAddress;
  let buyer2: SignerWithAddress;

  beforeEach(async function () {
    ({ parent, backgrounds, glasses, hands, hats, shirts, minter, catalog } = await loadFixture(
      fixture,
    ));
    [deployer, buyer1, buyer2] = await ethers.getSigners();
  });

  it('can mint pack and children are equipped', async function () {
    await minter.connect(buyer1).mintPacks(buyer1.address, 1, {
      value: ethers.utils.parseEther('0.1'),
    });

    expect(await parent.balanceOf(buyer1.address)).to.equal(1);
    expect(await parent.isChildEquipped(1, backgrounds.address, 1)).to.be.true;
    expect(await parent.isChildEquipped(1, glasses.address, 1)).to.be.true;
    expect(await parent.isChildEquipped(1, hands.address, 1)).to.be.true;
    expect(await parent.isChildEquipped(1, hats.address, 1)).to.be.true;
    expect(await parent.isChildEquipped(1, shirts.address, 1)).to.be.true;
  });
});

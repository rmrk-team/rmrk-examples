import { ethers } from 'hardhat';
import { Kingdom, Army, Soldier } from '../typechain-types';
import { deployKingdom, deployArmy, deploySoldier } from './deploy-methods';

export default async function getContracts(): Promise<{
  kingdom: Kingdom;
  army: Army;
  soldier: Soldier;
}> {
  let kingdom: Kingdom;
  let army: Army;
  let soldier: Soldier;

  // If we are on a local network, deploy the contracts and return them
  if ((await ethers.provider.getNetwork()).name === 'hardhat') {
    kingdom = await deployKingdom();
    army = await deployArmy();
    soldier = await deploySoldier();
  } else {
    // REPLACE THE ADDRESSSES FOR THE ONES YOU JUST DEPLOYED:
    const kingdomAddress = '0x1199844a6d09240cbaEb0fd0Ba64Fb089cd23Ae2';
    const kingdomFactory = await ethers.getContractFactory('Kingdom');
    kingdom = <Kingdom>kingdomFactory.attach(kingdomAddress);

    const armyAddress = '0x2504e3Dba8094B03eA4AD92fd50cCfdf4D2F9043';
    const armyFactory = await ethers.getContractFactory('Army');
    army = <Army>armyFactory.attach(armyAddress);

    const soldierAddress = '0x3FaA4C4824790a48c67888cc54FfE5b3C729f870';
    const soldierFactory = await ethers.getContractFactory('Soldier');
    soldier = <Kingdom>soldierFactory.attach(soldierAddress);
  }

  return { kingdom, army, soldier };
}

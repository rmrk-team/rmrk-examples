import { ethers, network } from 'hardhat';
import { getContracts } from './getContracts';

async function main(): Promise<void> {
  console.log(`Running kingdom journey on ${network.name} blockchain...`);

  const [wizard] = await ethers.getSigners();
  console.log(`Running journey with account: ${wizard.address}`);

  const { kingdom, army, soldier } = await getContracts();

  console.log(`Using Kingdom deployed at ${kingdom.address}`);
  console.log(`Using Army deployed at ${army.address}`);
  console.log(`Using Soldier deployed at ${soldier.address}`);

  // Journey starts here:

  const kingdom1Id = 1;
  const kingdom2Id = 2;

  // 1. Minting the kingdoms
  let tx = await kingdom.mint(
    wizard.address,
    1,
    'ipfs://QmQhDyuSvd49pxe5v2KnmvWT39TFyoqEQyBkhjYC7imHUs/kingdom/1.json',
  );
  await tx.wait();
  console.log('Minted Kingdom #1');
  tx = await kingdom.mint(
    wizard.address,
    1,
    'ipfs://QmQhDyuSvd49pxe5v2KnmvWT39TFyoqEQyBkhjYC7imHUs/kingdom/2.json',
  );
  await tx.wait();
  console.log('Minted Kingdom #2');

  // 2. Nest minting the armies
  tx = await kingdom.setAutoAcceptCollection(army.address, true);
  await tx.wait();
  console.log('Kingdoms will now auto-accept armies');

  tx = await army.nestMint(
    kingdom.address,
    3, // Number to mint
    kingdom1Id,
    'ipfs://Qma8tB38iAiqFAJpwz55d7sRQx4q7zZq1gzXkkK9wjehCg/generic.json',
  );
  await tx.wait();
  console.log('Minted 3 armies for Kingdom #1');
  tx = await army.nestMint(
    kingdom.address,
    2, // Number to mint
    kingdom2Id,
    'ipfs://Qma8tB38iAiqFAJpwz55d7sRQx4q7zZq1gzXkkK9wjehCg/generic.json',
  );
  await tx.wait();
  console.log('Minted 2 armies for Kingdom #2');

  // 3. Nest minting the soldiers
  tx = await army.setAutoAcceptCollection(soldier.address, true);
  await tx.wait();
  console.log('Armies will now auto-accept soldiers');

  const armies = [1, 2, 3, 4, 5];
  const soldiersPerArmy = [10, 20, 30, 14, 16];

  for (let i = 0; i < armies.length; i++) {
    tx = await soldier.nestMint(
      army.address,
      soldiersPerArmy[i],
      armies[i],
      'ipfs://QmQhDyuSvd49pxe5v2KnmvWT39TFyoqEQyBkhjYC7imHUs/soldiers/generic.json',
    );
    await tx.wait();
    console.log(`Minted ${soldiersPerArmy[i]} soldiers for Army #${armies[i]}`);
  }

  // 4. Armies balancing
  let childrenIds = (await army.childrenOf(3)).map((child) => child.tokenId.toNumber()); // Get children of Army #3
  let totalChildren = childrenIds.length;
  const childrenIdsToMove = childrenIds.slice(5).slice(-5); // Get the last 5 children
  // Loop from length to 0
  for (let i = 0; i < 5; i++) {
    const indexOnActiveChildren = totalChildren - i - 1;
    const indexOnChildrenToMove = 5 - i - 1;
    const childId = childrenIdsToMove[indexOnChildrenToMove];
    tx = await army.transferChild(
      3, // From Army #3
      army.address, // To another army
      1, // To Army #4
      indexOnActiveChildren, // Child index
      soldier.address, // Child contract
      childId, // Child ID
      false, // Not a pending child
      [], // Empty data
    );
    await tx.wait();
    console.log(
      `Moved child #${childId} at position ${indexOnActiveChildren} from Army #3 to Army #1`,
    );
  }

  // 5. Unnesting and burning
  const infectedSoldierId = 90;
  const [, infectedSoldiersArmyId] = await soldier.directOwnerOf(infectedSoldierId); // Return arguments are parent contract, parent id and whether parent is an NFT.
  childrenIds = (await army.childrenOf(infectedSoldiersArmyId)).map((child) =>
    child.tokenId.toNumber(),
  );
  const indexOfInfectedChild = childrenIds.indexOf(infectedSoldierId);
  tx = await army.transferChild(
    infectedSoldiersArmyId, // From Army #5
    wizard.address, // To wizard
    0, // No destination Id, since it's not an NFT
    indexOfInfectedChild, // Child index
    soldier.address, // Child contract
    infectedSoldierId, // Child ID
    false, // Not a pending child
    [], // Empty data
  );
  await tx.wait();
  console.log(
    `Moved child #${infectedSoldierId} at position ${indexOfInfectedChild} from Army #5 to wizard`,
  );

  tx = await soldier['burn(uint256)'](infectedSoldierId); // On ethers, when there are overloaded functions, you need to use the function signature.
  await tx.wait();
  console.log(`Burned soldier #${infectedSoldierId}`);

  // 6. Burn NFTs recursively

  // Transfer infected army
  tx = await kingdom.transferChild(
    kingdom2Id, // From Kingdom #2
    wizard.address, // To wizard
    0, // No destination Id, since it's not an NFT
    1, // Child index
    army.address, // Child contract
    infectedSoldiersArmyId, // Child ID
    false, // Not a pending child
    [], // Empty data
  );
  await tx.wait();
  console.log(`Moved Army #${infectedSoldiersArmyId} from Kingdom #2 to wizard`);

  // Burn infected army with all of it's children
  totalChildren = (await army.childrenOf(infectedSoldiersArmyId)).length;
  tx = await army['burn(uint256,uint256)'](infectedSoldiersArmyId, totalChildren); // If there are more children to burn, the function would revert to prevent from burning new arrivals.
  await tx.wait();
  console.log(`Burned Army #${infectedSoldiersArmyId} with all of it's children`);

  // 7. Remove auto accepting
  tx = await army.setAutoAcceptCollection(soldier.address, false);
  await tx.wait();
  console.log('Armies will no longer auto-accept soldiers');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

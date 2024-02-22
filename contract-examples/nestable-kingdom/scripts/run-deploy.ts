import { deployKingdom, deployArmy, deploySoldier } from './deploy-methods';

async function main() {
  await deployKingdom();
  await deployArmy();
  await deploySoldier();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

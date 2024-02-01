import { deployChunkies, deployChunkyItems } from './deploy-methods';

async function main() {
  await deployChunkies();
  await deployChunkyItems();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

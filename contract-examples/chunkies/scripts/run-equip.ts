import * as C from './constants';
import getDeployedContracts from './get-deployed-contracts';

async function main() {
  const { chunkies, chunkyItems } = await getDeployedContracts();

  await chunkies.equip({
    tokenId: 1,
    childIndex: 0, // Bone is first item
    assetId: 1, // First parent's asset
    slotPartId: C.CHUNKY_LEFT_HAND_SLOT_PART_ID,
    childAssetId: 1, // Bone's asset for left hand
  });
  await chunkies.equip({
    tokenId: 1,
    childIndex: 1, // Flag is second item
    assetId: 1, // First parent's asset
    slotPartId: C.CHUNKY_RIGHT_HAND_SLOT_PART_ID,
    childAssetId: 4, // Flag's asset for right hand
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

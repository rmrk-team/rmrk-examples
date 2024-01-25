import { ethers } from 'hardhat';
import * as C from './constants';
import { Chunky, ChunkyCatalog, ChunkyItem } from '../typechain-types';

async function main() {
  const chunkyFactory = await ethers.getContractFactory('Chunky');
  const itemFactory = await ethers.getContractFactory('ChunkyItem');
  const catalogFactory = await ethers.getContractFactory('ChunkyCatalog');
  const chunkies = <Chunky> chunkyFactory.attach('0x525263A85Df6603802Db0fba1c1a0B3ab55467D2');
  const items = <ChunkyItem> itemFactory.attach('0x8F9F31aB99030A835D2181166dd875e9EB132dDe');
  const catalog = <ChunkyCatalog> catalogFactory.attach('0x84145c8766c464432ebdf3B0FFCdda5194F74cE8');

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

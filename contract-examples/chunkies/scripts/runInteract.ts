import { ethers } from 'hardhat';
import * as C from './constants';
import { Chunky, ChunkyCatalog, ChunkyItem } from '../typechain-types';

async function main() {
  const chunkyFactory = await ethers.getContractFactory('Chunky');
  const itemFactory = await ethers.getContractFactory('ChunkyItem');
  const catalogFactory = await ethers.getContractFactory('ChunkyCatalog');
  const chunkies = <Chunky> chunkyFactory.attach('0xB275C0B949E386460dAfc150fB5D72f4E9a781dA');
  const items = <ChunkyItem> itemFactory.attach('0x4AF5B3f3129f1d99C51dDdE45231CDff3E1C5bEE');
  const catalog = <ChunkyCatalog> catalogFactory.attach('0x6a6517d4eddA32e55b013EE8092b56EE46cEeED7');

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

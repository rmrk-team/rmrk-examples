import hardhat from 'hardhat';
import { getAttributesRepository } from '../tasks/utils';
import { RMRKTokenAttributesRepository } from '../typechain-types';

type BattleStats = {
  attack: number;
  defense: number;
  health: number;
  stamina: number;
  maxHealth: number;
  maxStamina: number;
  level: number;
  freePoints: number;
  experience: number;
  lastStatsUpdate: number;
};

function mergeStats(stats: BattleStats): bigint {
  let mergedStats: bigint = BigInt(stats.attack);
  mergedStats |= BigInt(stats.defense) << 24n; // 24 bits offset
  mergedStats |= BigInt(stats.health) << 48n; // 24 bits offset
  mergedStats |= BigInt(stats.stamina) << 72n; // 24 bits offset
  mergedStats |= BigInt(stats.maxHealth) << 96n; // 24 bits offset
  mergedStats |= BigInt(stats.maxStamina) << 120n; // 24 bits offset
  mergedStats |= BigInt(stats.level) << 144n; // 24 bits offset
  mergedStats |= BigInt(stats.freePoints) << 160n; // 16 bits offset
  mergedStats |= BigInt(stats.experience) << 176n; // 16 bits offset
  mergedStats |= BigInt(stats.lastStatsUpdate) << 208n; // 32 bits offset
  return mergedStats;
}

function unmergeStats(mergedStats: bigint): BattleStats {
  return {
    attack: Number(mergedStats & 0xffffffn),
    defense: Number((mergedStats >> 24n) & 0xffffffn),
    health: Number((mergedStats >> 48n) & 0xffffffn),
    stamina: Number((mergedStats >> 72n) & 0xffffffn),
    maxHealth: Number((mergedStats >> 96n) & 0xffffffn),
    maxStamina: Number((mergedStats >> 120n) & 0xffffffn),
    level: Number((mergedStats >> 144n) & 0xffffn),
    freePoints: Number((mergedStats >> 160n) & 0xffffn),
    experience: Number((mergedStats >> 176n) & 0xffffffffn),
    lastStatsUpdate: Number((mergedStats >> 208n) & 0xffffffffn),
  };
}

async function setStats(
  tokenAttributes: RMRKTokenAttributesRepository,
  collection: string,
  tokenId: number,
  stats: BattleStats,
  attributesKey: string,
) {
  const mergedStats = mergeStats(stats);
  const tx = await tokenAttributes.setUintAttribute(
    collection,
    tokenId,
    attributesKey,
    mergedStats,
  );
  await tx.wait();
  console.log(`Set stats for token ${tokenId} in ${collection}`);
}

async function getStats(
  tokenAttributes: RMRKTokenAttributesRepository,
  collection: string,
  tokenId: number,
  attributesKey: string,
): Promise<BattleStats> {
  console.log(`Getting stats for token ${tokenId} in ${collection}`);
  const mergedStats = await tokenAttributes.getUintAttribute(collection, tokenId, attributesKey);
  return unmergeStats(mergedStats);
}

async function main() {
  const collection = '0xe020c035e3E6903370A52277257f83B9541712FA';
  const attributesKey = 'Stats';
  const accessType = 4;
  const [deployer] = await hardhat.ethers.getSigners();
  const tokenAttributes = await getAttributesRepository(hardhat);

  // Only needed once
  let tx = await tokenAttributes.manageAccessControl(
    collection,
    attributesKey,
    accessType,
    deployer.address,
  );
  await tx.wait();

  const tokenId = 1;
  const stats: BattleStats = {
    attack: 10,
    defense: 20,
    health: 15,
    stamina: 20,
    maxHealth: 25,
    maxStamina: 25,
    level: 3,
    freePoints: 0,
    experience: 12,
    lastStatsUpdate: Math.floor(Date.now() / 1000),
  };

  await setStats(tokenAttributes, collection, tokenId, stats, attributesKey);
  const storedStats = await getStats(tokenAttributes, collection, tokenId, attributesKey);
  console.log(storedStats);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

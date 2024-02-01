import { ethers } from 'hardhat';
import { deployCatalog } from './deploy-methods';
import { CHUNKY_CATALOG_METADATA, CHUNKY_CATALOG_TYPE } from './constants';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const catalogMetadataUri = CHUNKY_CATALOG_METADATA; // TODO: Replace with IPFS with metadata for collection, e.g. 'ipfs://collectionMeta.json' See https://evm.rmrk.app/metadata#catalog for more info on expected content
  const catalogType = CHUNKY_CATALOG_TYPE; // TODO: Replace with catalog mime type, e.g. 'image/png'

  if (catalogMetadataUri === undefined || catalogType === undefined) {
    console.log('Please set catalogMetadataUri and catalogType in scripts/run-deploy-catalog.ts');
    return;
  }

  await deployCatalog(catalogMetadataUri, catalogType);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

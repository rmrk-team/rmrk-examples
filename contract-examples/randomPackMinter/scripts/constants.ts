import { ethers } from 'ethers';

// TODO: Update names and symbols
export const PARENT_COLLECTION_NAME = 'Parent';
export const PARENT_COLLECTION_SYMBOL = 'PRNT';
export const BACKGROUNDS_COLLECTION_NAME = 'Background';
export const BACKGROUNDS_COLLECTION_SYMBOL = 'BCK';
export const GLASSES_COLLECTION_NAME = 'Glasses';
export const GLASSES_COLLECTION_SYMBOL = 'GLSS';
export const HANDS_COLLECTION_NAME = 'Hands';
export const HANDS_COLLECTION_SYMBOL = 'HND';
export const HATS_COLLECTION_NAME = 'Hats';
export const HATS_COLLECTION_SYMBOL = 'HAT';
export const SHIRTS_COLLECTION_NAME = 'Shirts';
export const SHIRTS_COLLECTION_SYMBOL = 'SHRT';

export const BASE_METADATA_URI = 'ipfs://ABC'; // TODO: Set the right IPFS hash for metadata.
export const PARENT_COLLECTION_METADATA = `${BASE_METADATA_URI}/parent/metadata.json`;
export const BACKGROUNDS_COLLECTION_METADATA = `${BASE_METADATA_URI}/backgrounds/metadata.json`;
export const GLASSES_COLLECTION_METADATA = `${BASE_METADATA_URI}/glasses/metadata.json`;
export const HANDS_COLLECTION_METADATA = `${BASE_METADATA_URI}/hands/metadata.json`;
export const HATS_COLLECTION_METADATA = `${BASE_METADATA_URI}/hats/metadata.json`;
export const SHIRTS_COLLECTION_METADATA = `${BASE_METADATA_URI}/shirts/metadata.json`;

export const PARENT_ASSETS_BASE_URI = `${BASE_METADATA_URI}/parent/assets/`;
export const BACKGROUNDS_ASSETS_BASE_URI = `${BASE_METADATA_URI}/backgrounds/assets/`;
export const GLASSES_ASSETS_BASE_URI = `${BASE_METADATA_URI}/glasses/assets/`;
export const HANDS_ASSETS_BASE_URI = `${BASE_METADATA_URI}/hands/assets/`;
export const HATS_ASSETS_BASE_URI = `${BASE_METADATA_URI}/hats/assets/`;
export const SHIRTS_ASSETS_BASE_URI = `${BASE_METADATA_URI}/shirts/assets/`;

export const ASSETS_EXTENSION = '.json';

export const CATALOG_METADATA_URI = `${BASE_METADATA_URI}/catalog/metadata.json`;
export const CATALOG_TYPE = 'image/png';

// TODO: Set the odds for each asset, in the same order as the consecutive. The total items per type must match the total assets defined in the input csv, and must sum 100
export const PARENT_ASSETS_ODDS = [50, 50];
export const BACKGROUNDS_ASSETS_ODDS = [50, 50];
export const GLASSES_ASSETS_ODDS = [50, 50];
export const HANDS_ASSETS_ODDS = [50, 50];
export const HATS_ASSETS_ODDS = [50, 50];
export const SHIRTS_ASSETS_ODDS = [50, 50];

export const PARENT_TOTAL_ASSETS = PARENT_ASSETS_ODDS.length;
export const BACKGROUNDS_TOTAL_ASSETS = BACKGROUNDS_ASSETS_ODDS.length;
export const GLASSES_TOTAL_ASSETS = GLASSES_ASSETS_ODDS.length;
export const HANDS_TOTAL_ASSETS = HANDS_ASSETS_ODDS.length;
export const HATS_TOTAL_ASSETS = HATS_ASSETS_ODDS.length;
export const SHIRTS_TOTAL_ASSETS = SHIRTS_ASSETS_ODDS.length;

export const PARENT_EQUIPPABLE_GROUP_ID = 1; // Only useful if we decide to make parents equippable into something

// For children, we use the same slot id as equippable group id
export const BACKGROUNDS_SLOT_ID = 1001;
export const GLASSES_SLOT_ID = 1002;
export const HANDS_SLOT_ID = 1003;
export const HATS_SLOT_ID = 1004;
export const SHIRTS_SLOT_ID = 1005;

export const PARENT_FIXED_METADATA = `${BASE_METADATA_URI}/catalog/parent/`;
export const BACKGROUNDS_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/backgrounds.json`;
export const GLASSES_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/glasses.json`;
export const HANDS_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/hands.json`;
export const HATS_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/hats.json`;
export const SHIRTS_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/shirts.json`;

// TODO: Updated if needed to match the order in which the layers should be rendered. I leave a free number between each layer in case we need to add more layers in the future
export const BACKGROUNDS_Z_INDEX = 0;
export const BODY_Z_INDEX = 2;
export const SHIRTS_Z_INDEX = 4;
export const HATS_Z_INDEX = 6;
export const GLASSES_Z_INDEX = 8;
export const HANDS_Z_INDEX = 10;

// TODO: Update max supply, beneficiary, royalties and mint price
export const MAX_SUPPLY = 10000;
export const BENEFICIARY = ''; // Leave empty to set to deployer address
export const ROYALTIES_BPS = 1000; // 10%
export const MINT_PRICE = ethers.utils.parseEther('0.1');

// PART TYPES (Defined by standard)
export const PART_TYPE_SLOT = 1;
export const PART_TYPE_FIXED = 2;

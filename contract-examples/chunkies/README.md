# Composable Chunkies

In this RMRK example you will find the contracts, scripts, assets and metadata needed to create a composable and equippable collection.

## Contracts

We have 2 custom contracts for Chunkies: `Chunkies` nand `ChunkyItems` and `ChunkyCatalog`. Additionally we have `MockRMRKRegistry` and will be using other contracts directly from the `@rmrk-team/evm-contracts` package.

1. `Chunkies` is the main character, its assets are composed of 3 parts from the catalog: head, body and hands. It has 2 equippable slots, 1 per hand. It is based on the equippable pre-mint implementation and includes utility methods to mint with an equippable asset and to set collections which are auto-accepted when nest transferred to any of its tokens.
2. `ChunkyItems` is for the NFTs that can be equipped into the Chunkies. It is also based on the equippable pre-mint implementation. Each NFT will have 2 assets, one to be equipped on each hand. It adds utility methods to create equippable assets for both hands in a single call and to nestMint tokens with a list of assets directly included.
4. `MockRMRKRegistry` is a utility contract needed to be able to add your collection directly from the deploy script. This requires no permissions on testing networks, but you need to receive permission from RMRK in order to run on production, please contact us before trying or your script will break halfway through.

## Scripts

1. In `constants.ts` we define all constants for the deploy, including URIs for collection metadata, base URIs for all assets, fixed and slot part ids, z indexes and equippable groups. This is a good practice which makes minting scripts much clearer.
2. `get-gegistry.ts` exposes the `getRegistry` method, this returns an instance of the Registry contract which the deploy script uses to add the collection to Singular. It is included in the evm-template repo.
3. `get-deployed-contracts.ts` exposes the `getDeployedContracts` method, this returns the instances of the deployed contracts for `Chunkies`, `ChunkyItems` and `Catalog`.
4. `deploy-methods.ts` has most of the logic to deploy your contracts, configure them and mint NFTs. From evm-template it has methods to deploy multiple contract utils and a ready to use catalog. The methods added for this specific use case are:
   1. `deployChunkies`: Deploys the Chunkies contract and verifies it.
   1. `deployChunkyItems`: Deploys the ChunkyItems contract and verifies it.
   1. `configureCatalog`: Adds fixed and slots parts to the catalog. For the slot parts, the items are set as a collection which can use this slot.
   1. `mintChunkies`: For every chunky it adds an equippable asset entry, mints the chunky and adds the asset to it.
   1. `addItemAssets`: Adds equippable assets for each type of item, for both hands. It also sets the valid parent for equippable groups to link assets from each hand with the right slot and parent.
   1. `mintItems`. For each item NFT it mints it, adds both assets to the token and nest transfers it to a chunky. It is done step by step to demonstrate basic usage and then using the custom method which does 4 operations in a single call.
5. `run-configure-and-mint.ts`: Using the deployed contracts it runs calls all the necessary configurations and mints both chunkies and items.
6. `run-deploy-catalog.ts`:  Deploys a standard catalog implementation. It is included in the evm-template repo.
7. `run-deploy-utils.ts`:  Deploys a set of utility contracts needed to render composable NFTs. It is included in the evm-template repo.
8. `run-equip.ts` Using the deployed contracts, equips two items into the first chunky, one for each hand.

## Assets

Here are all the assets that we will use for the project. It's convenient to upload them all under the same IPFS directory so we can easily construct all the metadata from there.

1. `chunkies`
   1. `full`: prerender of each chunky, useful for backwards compatibility since this is what tokenURI will return. Alternatively you can have a single image as fallback for all items, this option is ideal for collections where parts are selected on mint since there is now way to know beforehand all the combinations.
   2. `parts`: body, head and hand for each of our chunky versions.
2. `items`: for each item we have a folder with the version for left hand, right hand a thumbnail. The thumb is used for both assets for when it is displayed in every place besides being equipped.
3. `preview.png`: We will use it as the collection image. We could have used it as fallback if we did not want to generate the composed versions.
4. `alt_asset.jpg`: Additional asset in case we want to demonstrate adding a new asset and make it the main one. Not used for now.

## Metadata

Here we have all the metadata we need for the project. In a bigger project you will probably generate this using scripts, this time it was done by hand since we will mint only a few NFTs.

1. `catalog`:
   1. `fixed`: for each chunky version we have the metadata of each of the 3 fixed parts.
   2. `slots`: for each hand, this is where the name of the slot is taken from. You could add a mediaURI to use as fallback for when there is nothing equipped into the slot.
   3. `metadata.json`: describing the catalog.
2. `chunkies`:
   1. `full`: For each chunky, the metadata to return on tokenURI calls, it points to the pre-generated composed image.
   2. `alt_asset.json`: Additional asset in case we want to demonstrate adding a new asset and make it the main one. Not used for now.
   3. `collection.json`: For collection metadata.
3. `items`:
   1. For each item, the metadata for each hand asset. Notice that it defines `thumbnailURI` pointing to the full image on both assets, and sets `preferThumb` to `true`, so the thumb is used everywhere but on composing if equipped.
   2. `collection.json`: For collection metadata.

## Tests

There is a single test demonstrating a few points:

1. How to use fixtures to set up everything before the tests, these will make your tests faster.
2. The fixture uses the same methods as the deploy script, a good practice to avoid unexpected behavior.
3. Deploys a render utils contract, used to easily compose NFTs, among several other utility methods.
4. Tests equipping 2 items on both hand slots for the first chunky, and gets all the metadata necessary to compose the parent chunky.

## Instructions

1. Install packages with `pnpm`, `npm i` or `pnpm i`. This example uses `pnpm`.
2. Test contracts compile: `pnpm hardhat compile`
3. Check contract size: `pnpm hardhat size-contracts`
4. Run tests: `pnpm test`
5. Run prettier: `pnpm prettier`
6. Copy .env.example into .env and set your variables
7. Use `contracts/`, `tests/` and `scripts/` to build your code.
8. Deploy and mint on a supported network or on a local hardhat node (see below).:
```bash copy
pnpm hardhat run scripts/run-deploy.ts --network SET_BLOCKCHAIN_HERE
pnpm hardhat run scripts/run-deploy-catalog.ts --network SET_BLOCKCHAIN_HERE
# IMPORTANT! Set the deployed addresses into get-deployed-contracts.ts
pnpm hardhat run scripts/run-configure-and-mint.ts --network SET_BLOCKCHAIN_HERE
pnpm hardhat run scripts/run-equip.ts --network SET_BLOCKCHAIN_HERE
```

Supported networks:
- Local: `localhost`
- Testing: `moonbaseAlpha`, `sepolia`, `polygonMumbai`, `baseSepolia`
- Production: `moonbeam`, `mainnet`, `polygon`, `base`, `astar`, `bsc`

### Local Hardhat node testing

To Preview your results in a simple UI, you can run scripts against local hardhat node and use provided UI to preview the result.

In one terminal window run:
```bash
pnpm hardhat node
```

Then in another terminal window run:

Deploy your contracts, mint NFT and add assets:
```bash copy
pnpm hardhat run scripts/run-deploy.ts --network localhost
pnpm hardhat run scripts/run-deploy-catalog.ts --network localhost
# IMPORTANT! Set the deployed addresses into get-deployed-contracts.ts
pnpm hardhat run scripts/run-configure-and-mint.ts --network localhost
```

Deploy utility contracts needed to render your composable NFTs:
> This step is only needed for local network or network unsupported by RMRK where utility contracts are not yet deployed. [You can find supported networks here](https://github.com/rmrk-team/rmrk-js/blob/main/packages/rmrk-evm-utils/src/lib/rmrk-contract-addresses.ts)
```bash
pnpm hardhat run scripts/run-deploy-utils.ts --network localhost
```

Equip items on Chunky
Open `scripts/run-equip.ts` file and edit chunky collection contract address, and then run
```bash
pnpm hardhat run scripts/run-equip.ts --network localhost
```
Once done, head over to [react-nextjs-example](../../react-nextjs-example) and follow instructions there to run the UI.

---

Remember to give credit to RMRK if you're using its technology. Check the license and notice for more details.

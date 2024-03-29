# Instructions

This is a simple template to deploy a set equippable collections, with a parent and 5 children. The mint happens through an additional contract, which takes care of:

1. Charging the user, in native currency.
2. Randomly picking the asset for each of the NFTs.
3. Minting the parent.
4. Nest minting all children into the parent.
5. Equipping all children.
6. Sending the parent to the buyer.

Here we simply provide a ready to use version with a parent and 5 common equippables, but you may add or remove children by adapting the minter contract, deploy scripts, the constants and the generate metadata file. This is what you need to follow to deploy as it is.

1. Install packages with `yarn` or `npm i`
2. Compile contracts: `yarn hardhat compile`
3. Copy `.env.example` into `.env` and set your variables. You need `PRIVATE_KEY` and `{BLOCK_EXPLORER}_API_KEY` to verify your contracts. You can get `BLOCK_EXPLORER_API_KEY` easily from block scanners, please do.
4. Add your images under assets. For each collection you need:
   1. A collection banner (to later set on Singular, you can omit pinning it.)
   2. A collection thumbnail.
   3. Equipped version for each item (with transparent background and expected size and location).
   4. Thumbnail version for each item (the one seen when not equipped, can have background and different size and location).
   5. DO NOT CHANGE the structure nor naming and use sequential numbers (i.e. 1, 2, 3, etc.), always starting from 1.
5. Pin the whole assets folder to IPFS. It is important to pin the whole folder, so that all the files will have the same IPFS CID prefix (i.e. `ipfs://QmdP7bGpxRDvVVStMe8zWzm8zJH1CfvWtKtycECUTGMf2y/background/equipped/1.png`, `ipfs://QmdP7bGpxRDvVVStMe8zWzm8zJH1CfvWtKtycECUTGMf2y/background/equipped/2.png`, etc.). If not possible, you need at least the same URI per collection.
6. Fill the csv files under `./preprocess/input/`. There is one per collection and one for the metadata of all collections. The number of rows in per-collection csvs should match the number of assets in corresponding assets/{collection}/equipped and assets/{collection}/thumb folders.
7. Review and address all of the `TODO`s in `./preprocess/generate_metadata.py`. These include:
   - Setting external URI, it can be to your website or socials.
   - Set the base URI for assets, for each of the collections. From step 5.
   - Set the right extension for your assets.
   - Add additional attributes if needed, you can also remove the example one.
   - Set the right extension for your collection thumbnails.
   - Set a more descriptive catalog name and description.
8. Run generate metadata:
   ```
   ./preprocess/generate_metadata.py
   ```
   or
   ```
   python preprocess/generate_metadata.py
   ```
   depending on your OS.
9. Upload the entire metadata folder to IPFS. It must be under the same URI for the scripts to work. Alternatively you would need to edit the constants file to make it independent per collection.
10. Review and address all of the `TODO`s in `./scripts/constants.ts`. These include:

- Setting custom name and symbols.
- Setting base metadata URI, from step 9.
- Set the odds for each asset. e.g. Say you have 5 hats, you want the first 2 to be common and the other not so much, you can set priorities to: `[35, 35, 12, 12, 6]`. The latest would be the rarest. This won't guarantee exact distribution since it is just a probability, but it actual minted numbers will be very close.
- Update z-indexes if needed, you probably don't.
- Update max supply, beneficiary, royalties and mint price.

11. You are ready to deploy. We recommend you do in 3 steps.

- On the local hardhat network to make sure there are no errors:
  ```
  yarn hardhat run scripts/deploy.ts
  ```
- On a test net to make sure everything is as expected. Mint some NFTs and they will show up in a few minutes in [Singular](https://dev.singular.app/):
  ```
  yarn hardhat run scripts/deploy.ts --network {test-blockchain}
  ```
  Ping us through the [implementers channel on telegram](https://t.me/rmrkimpl) so we add you to the allow list to add collections to singular in production. This must happen before you deploy to production, so the script runs smoothly and your collection is ready to be traded in singular from day 1.
- Finally, deploy to production:
  ```
  yarn hardhat run scripts/deploy.ts --prod-network {blockchain}
  ```

Available test networks:

- `moonbaseAlpha`
- `sepolia`
- `polygonMumbai`
- `baseGoerli`

Available production networks:

- `moonbeam`
- `mainnet`
- `polygon`
- `base`
- `astar`
- `bsc`

Remember to give credit to RMRK if you're using it's technology. Check the [license](LICENSE) and [notice](NOTICE.md) for more details.

You will need to implement a UI for the minting. This repository is not focused on that, but the main interactions you might need are described next, using ethers v5. We plan to add UI examples in this same repository.

```typescript
import { ethers } from "ethers"
// Available at the root of this project. If you update the contract, you can get it after compiling at `./artifacts/contracts/RandomPackMinter.sol/RandomPackMinter.json`  At the `abi` property:
import { minterABI } from "./RandomPackMinterABI"

const minterAddress = "0x1234567890123456789012345678901234567890" // You get this from the deploy script
const numPacks = 1n // Take this from user input
const provider = new ethers.providers.JsonRpcProvider("{YOUR_RPC_URL}") // You may also get provider from your framework, or user's wallet
const signer = provider.getSigner() // You may also get signer from your framework, or user's wallet

const minter = new ethers.Contract(minterAddress, minterABI, provider)

// To get total number of packs minted and price:
const packsMinted = await minter.getPacksMinted()
const packPrice = await minter.getMintPrice()

// To mint:
const tx = await minter
  .connect(signer)
  .mintPacks(signer.address, numPacks, { value: packPrice * numPacks })
const receipt = await tx.wait()

// This is the simplest way to detect the pack Id. Using frameworks may give you a more convenient way to do it.
const targetTopic = ethers.utils.id(
  "PackMinted(address,uint256,uint64,uint64,uint64,uint64,uint64,uint64)"
)

for (const log of receipt.logs) {
  if (log.topics[0] === targetTopic) {
    console.log(log)
    const parsedEvent = minter.interface.parseLog(log)
    const packId = parsedEvent.args.packId
    // Do something with packId, minted ids accross all collections will match thisId
    break
  }
}
```

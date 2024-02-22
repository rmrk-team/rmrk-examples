import { ethers, network } from 'hardhat';
import { getCookbook } from './get-cookbook';

async function main(): Promise<void> {
  console.log(`Running cookbook journey on ${network.name} blockchain...`);

  const [master, alice] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${master.address}`);
  console.log(`Deploying contracts with the account: ${alice.address}`);

  const cookbook = await getCookbook();
  console.log(`Using Cookbook deployed at ${await cookbook.getAddress()}.`);

  // Journey starts here:

  // 1. Minting NFTs
  // The ipfs URI points to a JSON file that contains the metadata for the NFT.
  let tx = await cookbook
    .connect(master)
    .mint(
      master.address,
      1,
      'ipfs://QmWcoQ7MvDRVCBZ2Xii3TtNYThdoibztG1gkutDHyS6KQk/masters-cookbook.json',
    );
  await tx.wait();
  console.log(`Minted token with id 1 for ${master.address}`);

  // 2. Recipes creation - Adding assets to the collection
  const assets = [
    'ipfs://QmQSoP7iT9C7PdNPvoxhKSvXq3Bkpxnz9AC6N7GCoJDNVt/1-carbonara.json',
    'ipfs://QmQSoP7iT9C7PdNPvoxhKSvXq3Bkpxnz9AC6N7GCoJDNVt/2-cesar-salad.json',
    'ipfs://QmQSoP7iT9C7PdNPvoxhKSvXq3Bkpxnz9AC6N7GCoJDNVt/3-grilled-salmon.json',
  ];
  for (const asset of assets) {
    tx = await cookbook.connect(master).addAssetEntry(asset);
    await tx.wait();
  }
  console.log(`Added ${assets.length} assets to the collection`);

  // 3. Recipes creation - Adding assets to a token
  const masterCookbookId = 1; // We know this because it is the second minted token, in a production environment you would get it from the emitted Transfer event, since there might be other tokens minted in between.
  const assetIds = [1, 2, 3]; // Similarly, in production you would read the AssetAddedToTokens event to get the asset ids.
  for (const assetId of assetIds) {
    tx = await cookbook.connect(master).addAssetToToken(masterCookbookId, assetId, 0);
    await tx.wait();
  }
  console.log(`Added ${assetIds.length} assets to the token ${masterCookbookId}`);

  // 4. Managing Contributors
  tx = await cookbook.connect(master).manageContributor(alice.address, true);
  await tx.wait();
  console.log(`Added ${alice.address} as a contributor`);

  // 5. Alice Creates her cookbook - Minting a new token and adding assets to it
  const assetsByAlice = [
    'ipfs://QmQSoP7iT9C7PdNPvoxhKSvXq3Bkpxnz9AC6N7GCoJDNVt/4-stir-fry.json',
    'ipfs://QmQSoP7iT9C7PdNPvoxhKSvXq3Bkpxnz9AC6N7GCoJDNVt/5-chocolate-cake.json',
  ];
  tx = await cookbook
    .connect(alice)
    .mint(
      alice.address,
      1,
      'ipfs://QmWcoQ7MvDRVCBZ2Xii3TtNYThdoibztG1gkutDHyS6KQk/alices-cookbook.json',
    );
  await tx.wait();
  for (const asset of assetsByAlice) {
    tx = await cookbook.connect(alice).addAssetEntry(asset);
    await tx.wait();
  }
  const alicesCookbookId = 2;
  const assetIdsByAlice = [4, 5];
  for (const assetId of assetIdsByAlice) {
    tx = await cookbook.connect(alice).addAssetToToken(alicesCookbookId, assetId, 0);
    await tx.wait();
  }
  console.log(`Added ${assetsByAlice.length} assets to the token ${alicesCookbookId}`);

  // 6. Collaboration - Accepting assets proposed by others
  tx = await cookbook
    .connect(master)
    .addAssetEntry('ipfs://QmQSoP7iT9C7PdNPvoxhKSvXq3Bkpxnz9AC6N7GCoJDNVt/6-chicken-tikka.json');
  await tx.wait();
  const masterToAliceAssetId = 6;
  tx = await cookbook.connect(master).addAssetToToken(alicesCookbookId, masterToAliceAssetId, 0);
  await tx.wait();
  tx = await cookbook.connect(alice).acceptAsset(alicesCookbookId, 0, masterToAliceAssetId);
  await tx.wait();
  console.log(`Accepted asset ${masterToAliceAssetId} from ${master.address}`);

  // 7. Alice improves recipe - Asset replacement
  tx = await cookbook
    .connect(alice)
    .addAssetEntry('ipfs://QmSMs4nsW5LMKHbE4bqjCDQbwfSs6FKFPzkJWXFYtvuvjh');
  await tx.wait();
  const improvedAssetId = 7;
  tx = await cookbook
    .connect(alice)
    .addAssetToToken(alicesCookbookId, improvedAssetId, masterToAliceAssetId);
  await tx.wait();
  // Asset is auto accepted
  console.log(`Improved asset ${masterToAliceAssetId} with ${improvedAssetId}`);

  // 8. Master and Alice collaboration - Proposing assets to a token
  const assetsByMasterToAlice = [
    'ipfs://QmQSoP7iT9C7PdNPvoxhKSvXq3Bkpxnz9AC6N7GCoJDNVt/8-buddha-bowl.json`',
    'ipfs://QmQSoP7iT9C7PdNPvoxhKSvXq3Bkpxnz9AC6N7GCoJDNVt/9-shrimp-scamp-pasta.json',
  ];
  // Master adds the assets
  for (const asset of assetsByMasterToAlice) {
    tx = await cookbook.connect(master).addAssetEntry(asset);
    await tx.wait();
  }
  // Master adds the assets to Alice's cookbook
  const assetIdsByMasterToAlice = [8, 9];
  for (const assetId of assetIdsByMasterToAlice) {
    let tx = await cookbook.connect(master).addAssetToToken(alicesCookbookId, assetId, 0);
    await tx.wait();
  }
  // Master adds the first recipe to his cookbook
  tx = await cookbook
    .connect(master)
    .addAssetToToken(masterCookbookId, assetIdsByMasterToAlice[1], 0);
  await tx.wait();
  // Alice accepts the assets
  for (const assetId of assetIdsByMasterToAlice) {
    tx = await cookbook.connect(alice).acceptAsset(alicesCookbookId, 0, assetId);
    await tx.wait();
  }
  console.log(
    `Added ${assetIdsByMasterToAlice.length} assets to the token ${alicesCookbookId} and 1 to ${masterCookbookId}`,
  );

  // 9. Master retires - Token burning with related assets
  // await cookbook.connect(master).burn(masterCookbookId);
  // console.log(`Burned token ${masterCookbookId}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

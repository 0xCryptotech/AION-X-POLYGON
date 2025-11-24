import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting AION-X Deployment on Polygon Amoy...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "MATIC\n");

  // Step 1: Deploy AION Token
  console.log("📝 Step 1/4: Deploying AION Token...");
  const AIONToken = await ethers.getContractFactory("AIONToken");
  const token = await AIONToken.deploy();
  await token.deployed();
  console.log("✅ AION Token deployed to:", token.address);
  console.log("   Total Supply: 1,000,000,000 AION\n");

  // Step 2: Deploy Prediction Market
  console.log("📝 Step 2/4: Deploying Prediction Market...");
  const PredictionMarket = await ethers.getContractFactory("PredictionMarketAION");
  const market = await PredictionMarket.deploy(token.address);
  await market.deployed();
  console.log("✅ Prediction Market deployed to:", market.address);
  console.log("   Platform Fee: 2%\n");

  // Step 3: Deploy Staking Contract
  console.log("📝 Step 3/4: Deploying Staking Contract...");
  const AIONStaking = await ethers.getContractFactory("AIONStaking");
  const staking = await AIONStaking.deploy(token.address);
  await staking.deployed();
  console.log("✅ Staking Contract deployed to:", staking.address);
  console.log("   Min Stake: 100 AION");
  console.log("   Lock Period: 7 days\n");

  // Step 4: Deploy Faucet
  console.log("📝 Step 4/4: Deploying Faucet...");
  const AIONFaucet = await ethers.getContractFactory("AIONFaucet");
  const faucet = await AIONFaucet.deploy(token.address);
  await faucet.deployed();
  console.log("✅ Faucet deployed to:", faucet.address);
  console.log("   Claim Amount: 100 AION per 24h\n");

  // Step 5: Setup Integration
  console.log("🔗 Setting up contract integration...");
  
  // Set staking contract in market
  const tx1 = await market.setStakingContract(staking.address);
  await tx1.wait();
  console.log("✅ Market -> Staking integration set");
  
  // Set prediction market in staking
  const tx2 = await staking.setPredictionMarket(market.address);
  await tx2.wait();
  console.log("✅ Staking -> Market integration set\n");

  // Step 6: Fund Faucet
  console.log("💰 Funding Faucet with 100,000 AION...");
  const faucetAmount = ethers.utils.parseEther("100000");
  const tx3 = await token.transfer(faucet.address, faucetAmount);
  await tx3.wait();
  console.log("✅ Faucet funded\n");

  // Summary
  console.log("=" .repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=" .repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("   AION Token:        ", token.address);
  console.log("   Prediction Market: ", market.address);
  console.log("   Staking Contract:  ", staking.address);
  console.log("   Faucet:            ", faucet.address);
  
  console.log("\n📝 Next Steps:");
  console.log("1. Update backend/.env:");
  console.log(`   CONTRACT_ADDRESS=${market.address}`);
  console.log("\n2. Update frontend/.env:");
  console.log(`   VITE_CONTRACT_ADDRESS=${market.address}`);
  console.log(`   VITE_TOKEN_ADDRESS=${token.address}`);
  console.log(`   VITE_STAKING_ADDRESS=${staking.address}`);
  console.log(`   VITE_FAUCET_ADDRESS=${faucet.address}`);
  console.log("\n3. Copy ABI to backend:");
  console.log("   cp artifacts/contracts/PredictionMarketAION.sol/PredictionMarketAION.json ../backend/abi/");
  console.log("\n4. Verify contracts on PolygonScan:");
  console.log(`   npx hardhat verify --network polygonAmoy ${token.address}`);
  console.log(`   npx hardhat verify --network polygonAmoy ${market.address} ${token.address}`);
  console.log(`   npx hardhat verify --network polygonAmoy ${staking.address} ${token.address}`);
  console.log(`   npx hardhat verify --network polygonAmoy ${faucet.address} ${token.address}`);
  console.log("\n5. Create test markets:");
  console.log("   npx hardhat run scripts/seedDemoData.ts --network polygonAmoy");
  console.log("\n" + "=" .repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

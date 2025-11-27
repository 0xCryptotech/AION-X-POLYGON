import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Quick Deploy AION-X on Polygon Amoy...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.utils.formatEther(await deployer.getBalance()), "MATIC\n");

  // Get current nonce from network
  const nonce = await deployer.getTransactionCount("latest");
  console.log("Current nonce:", nonce);

  // Deploy AION Token
  console.log("📝 Deploying AION Token...");
  const AIONToken = await ethers.getContractFactory("AIONToken");
  const token = await AIONToken.deploy({ nonce });
  await token.deployed();
  console.log("✅ AION Token:", token.address);

  // Deploy Prediction Market
  console.log("📝 Deploying Prediction Market...");
  const PredictionMarket = await ethers.getContractFactory("PredictionMarketAION");
  const market = await PredictionMarket.deploy(token.address, { nonce: nonce + 1 });
  await market.deployed();
  console.log("✅ Prediction Market:", market.address);

  // Deploy Staking
  console.log("📝 Deploying Staking...");
  const AIONStaking = await ethers.getContractFactory("AIONStaking");
  const staking = await AIONStaking.deploy(token.address, { nonce: nonce + 2 });
  await staking.deployed();
  console.log("✅ Staking:", staking.address);

  // Deploy Faucet
  console.log("📝 Deploying Faucet...");
  const AIONFaucet = await ethers.getContractFactory("AIONFaucet");
  const faucet = await AIONFaucet.deploy(token.address, { nonce: nonce + 3 });
  await faucet.deployed();
  console.log("✅ Faucet:", faucet.address);

  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Update these in your .env files:");
  console.log(`VITE_TOKEN_ADDRESS=${token.address}`);
  console.log(`VITE_CONTRACT_ADDRESS=${market.address}`);
  console.log(`VITE_STAKING_ADDRESS=${staking.address}`);
  console.log(`VITE_FAUCET_ADDRESS=${faucet.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

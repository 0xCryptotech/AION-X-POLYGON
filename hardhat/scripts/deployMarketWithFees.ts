import { ethers } from "hardhat";

async function main() {
  // Get AION Token address from environment or previous deployment
  const AION_TOKEN_ADDRESS = process.env.AION_TOKEN_ADDRESS || "";
  
  if (!AION_TOKEN_ADDRESS) {
    console.error("❌ Error: AION_TOKEN_ADDRESS not set!");
    console.log("Please set AION_TOKEN_ADDRESS in .env or deploy token first");
    process.exit(1);
  }
  
  console.log("Deploying PredictionMarketAION with 2% fee mechanism...");
  console.log("Using AION Token:", AION_TOKEN_ADDRESS);
  
  const PredictionMarket = await ethers.getContractFactory("PredictionMarketAION");
  const market = await PredictionMarket.deploy(AION_TOKEN_ADDRESS);
  await market.deployed();
  
  console.log("✅ PredictionMarketAION deployed to:", market.address);
  console.log("\nFee Structure:");
  console.log("- Platform Fee: 2%");
  console.log("- Winners receive: 98% of pool");
  console.log("- Fee goes to: Staking contract");
  console.log("\nNext steps:");
  console.log("1. Run setupStakingIntegration.ts");
  console.log("2. Update frontend contract address");
  console.log("3. Update backend autoResolve.js");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

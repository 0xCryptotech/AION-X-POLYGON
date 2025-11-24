import { ethers } from "hardhat";

async function main() {
  const PREDICTION_MARKET_ADDRESS = "0x276c2de4D162875be9C9DF96f68dD80Be54E2838";
  const STAKING_ADDRESS = "0xd2B8aCD1Da99CFe52dD07DAca27536e6dB2D46F2";
  
  const [deployer] = await ethers.getSigners();
  console.log("Setting up integration with account:", deployer.address);

  const market = await ethers.getContractAt("PredictionMarketAION", PREDICTION_MARKET_ADDRESS);
  const staking = await ethers.getContractAt("AIONStaking", STAKING_ADDRESS);

  console.log("\n1. Setting staking contract in prediction market...");
  const tx1 = await market.setStakingContract(STAKING_ADDRESS);
  await tx1.wait();
  console.log("✅ Staking contract set");

  console.log("\n2. Setting prediction market in staking contract...");
  const tx2 = await staking.setPredictionMarket(PREDICTION_MARKET_ADDRESS);
  await tx2.wait();
  console.log("✅ Prediction market set");

  console.log("\n✅ Integration complete!");
  console.log("\nNow when battles resolve:");
  console.log("- 2% fee deducted from total pool");
  console.log("- Fee sent to staking contract");
  console.log("- Stakers earn proportional share");
  console.log("- Winners get 98% of pool");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

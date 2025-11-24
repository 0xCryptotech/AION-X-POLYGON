import { ethers } from "hardhat";

async function main() {
  const AION_TOKEN_ADDRESS = process.env.AION_TOKEN_ADDRESS || "";
  
  if (!AION_TOKEN_ADDRESS) {
    console.error("❌ Error: AION_TOKEN_ADDRESS not set!");
    console.log("Please set AION_TOKEN_ADDRESS in .env or deploy token first");
    process.exit(1);
  }
  
  console.log("Deploying AIONStaking contract (Real Yield Model)...");
  console.log("Using AION Token:", AION_TOKEN_ADDRESS);
  
  const AIONStaking = await ethers.getContractFactory("AIONStaking");
  const staking = await AIONStaking.deploy(AION_TOKEN_ADDRESS);
  await staking.deployed();
  
  console.log("✅ AIONStaking deployed to:", staking.address);
  console.log("\nStaking Model:");
  console.log("- Revenue Sharing: Stakers earn 2% of battle fees");
  console.log("- Variable APY: Depends on platform volume");
  console.log("- Min Stake: 100 AION");
  console.log("- Lock Period: 7 days");
  console.log("\nNext steps:");
  console.log("1. Update frontend with contract address");
  console.log("2. Set prediction market address");
  console.log("3. Test staking flow");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

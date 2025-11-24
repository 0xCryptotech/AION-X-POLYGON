import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "";
  
  if (!contractAddress) {
    console.error("❌ Error: CONTRACT_ADDRESS not set in .env");
    process.exit(1);
  }
  
  const contract = await ethers.getContractAt("PredictionMarketAION", contractAddress);

  console.log("Checking markets 52-61...\n");
  
  for (let i = 52; i <= 61; i++) {
    try {
      const market = await contract.markets(i);
      const statusNames = ["OPEN", "CLOSED", "RESOLVED"];
      console.log(`Market ${i}: ${market.title}`);
      console.log(`  Status: ${statusNames[market.status]}`);
      console.log(`  Close Time: ${new Date(market.closeTime.toNumber() * 1000).toLocaleString()}`);
      console.log(`  Total Staked: ${ethers.utils.formatEther(market.totalStaked)} AION`);
      console.log("");
    } catch (error) {
      console.log(`Market ${i}: ERROR - ${error.message}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

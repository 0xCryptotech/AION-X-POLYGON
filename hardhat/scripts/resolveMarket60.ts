import { ethers } from "hardhat";

async function main() {
  const marketAddress = "0x276c2de4D162875be9C9DF96f68dD80Be54E2838";
  const market = await ethers.getContractAt("PredictionMarketAION", marketAddress);
  
  console.log("Resolving market 60 (ETH/USD) as BEAR...");
  const tx = await market.resolveMarket(60, 1);
  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("✅ Market 60 resolved!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

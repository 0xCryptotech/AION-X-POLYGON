import { ethers } from "hardhat";

async function main() {
  const marketAddress = "0x276c2de4D162875be9C9DF96f68dD80Be54E2838";
  const market = await ethers.getContractAt("PredictionMarketAION", marketAddress);
  
  const info = await market.markets(60);
  const currentTime = Math.floor(Date.now() / 1000);
  
  console.log("\n=== Market 60 (ETH/USD) Status ===");
  console.log("Close Time:", new Date(Number(info.closeTime) * 1000).toLocaleString());
  console.log("Resolved:", info.resolved);
  console.log("Current Time:", new Date().toLocaleString());
  console.log("Minutes until close:", Math.floor((Number(info.closeTime) - currentTime) / 60));
  console.log("Total Pool:", ethers.formatEther(info.totalPool), "AION");
  console.log("Bull Pool:", ethers.formatEther(info.bullPool), "AION");
  console.log("Bear Pool:", ethers.formatEther(info.bearPool), "AION");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

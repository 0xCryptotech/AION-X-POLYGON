import { ethers } from "hardhat";

async function main() {
  const market = await ethers.getContractAt("PredictionMarketAION", "0x276c2de4D162875be9C9DF96f68dD80Be54E2838");
  const info = await market.markets(59);
  const currentTime = Math.floor(Date.now() / 1000);
  const closeTime = Number(info.closeTime);
  const minutesLeft = Math.floor((closeTime - currentTime) / 60);
  
  console.log("\n=== Market 59 (BTC/USD) ===");
  console.log("Status:", info.status === 0 ? "OPEN" : info.status === 1 ? "CLOSED" : "RESOLVED");
  console.log("Close Time:", new Date(closeTime * 1000).toLocaleString());
  console.log("Current Time:", new Date().toLocaleString());
  console.log("Minutes Left:", minutesLeft > 0 ? minutesLeft : "CLOSED");
}

main().catch(console.error);

import { ethers } from "hardhat";

async function main() {
  const marketId = 47;
  const outcome = 1; // 0=Bullish, 1=Bearish
  
  const contractAddress = "0x206E87B235661B13acC8E0bB7D39F9CA8B8Ade83";
  const contract = await ethers.getContractAt("PredictionMarketAION", contractAddress);
  
  // Close market first
  const closeTx = await contract.closeMarket(marketId);
  await closeTx.wait();
  console.log(`Market ${marketId} closed`);
  
  // Resolve market
  const resolveTx = await contract.resolveMarket(marketId, outcome);
  await resolveTx.wait();
  console.log(`Market ${marketId} resolved with outcome ${outcome}`);
}

main().catch(console.error);

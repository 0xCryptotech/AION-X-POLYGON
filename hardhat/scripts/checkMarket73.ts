import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x206E87B235661B13acC8E0bB7D39F9CA8B8Ade83";
  const contract = await ethers.getContractAt("PredictionMarketAION", contractAddress);
  const userAddress = "0x489efd5015f07138f2fd6b3d428b48b2587cb440";
  
  const market = await contract.markets(64);
  const betsCount = await contract.getMarketBetsCount(64);
  
  console.log("Market 64:", market.title);
  console.log("Status:", ["OPEN", "CLOSED", "RESOLVED"][market.status]);
  console.log("Total Bets:", betsCount.toString());
  
  for (let i = 0; i < betsCount.toNumber(); i++) {
    const bet = await contract.bets(64, i);
    if (bet.bettor.toLowerCase() === userAddress.toLowerCase()) {
      console.log("\nYour bet found!");
      console.log("  Outcome:", bet.outcome.toString(), bet.outcome.toString() === "0" ? "(Bullish)" : "(Bearish)");
      console.log("  Amount:", ethers.utils.formatEther(bet.amount), "AION");
    }
  }
}

main().catch(console.error);

import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x206E87B235661B13acC8E0bB7D39F9CA8B8Ade83";
  const contract = await ethers.getContractAt("PredictionMarketAION", contractAddress);
  
  const market = await contract.markets(35);
  const statusNames = ["OPEN", "CLOSED", "RESOLVED"];
  
  console.log("Market 35:");
  console.log("  Title:", market.title);
  console.log("  Status:", statusNames[market.status]);
  console.log("  Close Time:", new Date(market.closeTime.toNumber() * 1000).toLocaleString());
  console.log("  Current Time:", new Date().toLocaleString());
  console.log("  Total Staked:", ethers.utils.formatEther(market.totalStaked), "AION");
}

main().catch(console.error);

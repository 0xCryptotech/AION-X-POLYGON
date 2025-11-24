import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x206E87B235661B13acC8E0bB7D39F9CA8B8Ade83";
  const contract = await ethers.getContractAt("PredictionMarketAION", contractAddress);
  const userAddress = "0x489efd5015f07138f2fd6b3d428b48b2587cb440";
  
  const claimable = await contract.claimable(userAddress);
  console.log("Claimable:", ethers.utils.formatEther(claimable), "AION");
}

main().catch(console.error);

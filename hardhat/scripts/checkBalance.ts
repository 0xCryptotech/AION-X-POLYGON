import { ethers } from "hardhat";

async function main() {
  const aionAddress = "0x296DB144E62C8C826bffA4503Dc9Fbf29F25D44B";
  const aion = await ethers.getContractAt("AIONToken", aionAddress);
  
  // Ganti dengan address wallet Anda
  const userAddress = process.env.USER_ADDRESS || "YOUR_WALLET_ADDRESS";
  
  const balance = await aion.balanceOf(userAddress);
  console.log(`AION Balance: ${ethers.utils.formatEther(balance)} AION`);
}

main().catch(console.error);

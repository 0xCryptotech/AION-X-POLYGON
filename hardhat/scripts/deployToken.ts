import { ethers } from "hardhat";

async function main() {
  const AIONToken = await ethers.getContractFactory("AIONToken");
  const token = await AIONToken.deploy();
  await token.deployed();
  console.log("AION Token deployed to:", token.address);
  console.log("Total Supply: 1,000,000,000 AION");
}
main().catch((err) => { console.error(err); process.exit(1); });

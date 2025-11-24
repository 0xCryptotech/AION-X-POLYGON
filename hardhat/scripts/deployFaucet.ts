import { ethers } from "hardhat";

async function main() {
  const aionTokenAddress = process.env.AION_TOKEN_ADDRESS || "";
  
  if (!aionTokenAddress) {
    console.error("❌ Error: AION_TOKEN_ADDRESS not set!");
    console.log("Please set AION_TOKEN_ADDRESS in .env or deploy token first");
    process.exit(1);
  }
  
  console.log("Using AION Token:", aionTokenAddress);
  
  const AIONFaucet = await ethers.getContractFactory("AIONFaucet");
  const faucet = await AIONFaucet.deploy(aionTokenAddress);
  await faucet.deployed();
  
  console.log("AIONFaucet deployed to:", faucet.address);
  console.log("Claim Amount: 100 AION per day");
  console.log("\nNext: Transfer AION tokens to faucet address");
}
main().catch((err) => { console.error(err); process.exit(1); });

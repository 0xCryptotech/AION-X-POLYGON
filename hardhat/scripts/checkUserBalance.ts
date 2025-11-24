import { ethers } from "hardhat";

async function main() {
  const userAddress = "0xa94d9728f3e25c5bfd4c0fc372eca4e631cae55d";
  const aionAddress = "0x296DB144E62C8C826bffA4503Dc9Fbf29F25D44B";
  
  const aion = await ethers.getContractAt("AIONToken", aionAddress);
  const balance = await aion.balanceOf(userAddress);
  
  console.log(`AION Balance: ${ethers.utils.formatEther(balance)} AION`);
}

main().catch(console.error);

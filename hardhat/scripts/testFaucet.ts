import { ethers } from "hardhat";

async function main() {
  const FAUCET_ADDRESS = process.env.FAUCET_ADDRESS || "";
  const AION_TOKEN_ADDRESS = process.env.AION_TOKEN_ADDRESS || "";
  
  if (!FAUCET_ADDRESS || !AION_TOKEN_ADDRESS) {
    console.error("❌ Error: FAUCET_ADDRESS or AION_TOKEN_ADDRESS not set in .env");
    process.exit(1);
  }
  
  const [deployer] = await ethers.getSigners();
  console.log("Testing faucet with account:", deployer.address);

  const faucet = await ethers.getContractAt("AIONFaucet", FAUCET_ADDRESS);
  const aion = await ethers.getContractAt("AIONToken", AION_TOKEN_ADDRESS);

  // Check faucet balance
  const faucetBalance = await aion.balanceOf(FAUCET_ADDRESS);
  console.log("\n💰 Faucet AION Balance:", ethers.utils.formatEther(faucetBalance), "AION");

  // Check user balance before
  const balanceBefore = await aion.balanceOf(deployer.address);
  console.log("👤 User Balance Before:", ethers.utils.formatEther(balanceBefore), "AION");

  // Check claim status
  const lastClaim = await faucet.lastClaimTime(deployer.address);
  const cooldown = await faucet.cooldownTime();
  const claimAmount = await faucet.claimAmount();
  
  console.log("\n📊 Faucet Info:");
  console.log("- Claim Amount:", ethers.utils.formatEther(claimAmount), "AION");
  console.log("- Cooldown:", cooldown.toNumber() / 3600, "hours");
  console.log("- Last Claim:", lastClaim.toNumber() === 0 ? "Never" : new Date(lastClaim.toNumber() * 1000).toLocaleString());

  const now = Math.floor(Date.now() / 1000);
  const canClaim = now >= lastClaim.toNumber() + cooldown.toNumber();
  
  if (canClaim) {
    console.log("\n✅ Can claim now!");
    console.log("Claiming 100 AION...");
    
    try {
      const tx = await faucet.claim();
      await tx.wait();
      console.log("✅ Claim successful!");
      
      const balanceAfter = await aion.balanceOf(deployer.address);
      console.log("\n👤 User Balance After:", ethers.utils.formatEther(balanceAfter), "AION");
      console.log("💰 Received:", ethers.utils.formatEther(balanceAfter.sub(balanceBefore)), "AION");
    } catch (error: any) {
      console.error("❌ Claim failed:", error.message);
    }
  } else {
    const nextClaim = lastClaim.toNumber() + cooldown.toNumber();
    const timeLeft = nextClaim - now;
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    console.log(`\n⏳ Must wait ${hours}h ${minutes}m before next claim`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

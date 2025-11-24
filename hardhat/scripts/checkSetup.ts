import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  console.log("🔍 Checking Deployment Setup...\n");
  
  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log("   PROVIDER_URL:", process.env.PROVIDER_URL ? "✅ Set" : "❌ Not set");
  console.log("   OWNER_PRIVATE_KEY:", process.env.OWNER_PRIVATE_KEY ? "✅ Set" : "❌ Not set");
  
  if (!process.env.OWNER_PRIVATE_KEY || process.env.OWNER_PRIVATE_KEY === "0xYOUR_PRIVATE_KEY_HERE") {
    console.log("\n❌ ERROR: Private key not set!");
    console.log("\n📝 Please update hardhat/.env with your private key:");
    console.log("   OWNER_PRIVATE_KEY=0xYOUR_ACTUAL_PRIVATE_KEY\n");
    console.log("💡 Get private key from MetaMask:");
    console.log("   1. Open MetaMask");
    console.log("   2. Click ⋮ → Account details");
    console.log("   3. Show private key → Copy");
    console.log("   4. Paste in hardhat/.env\n");
    process.exit(1);
  }
  
  // Check private key format
  const privateKey = process.env.OWNER_PRIVATE_KEY;
  if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
    console.log("\n❌ ERROR: Invalid private key format!");
    console.log("   Expected: 0x followed by 64 hex characters");
    console.log("   Got length:", privateKey.length);
    process.exit(1);
  }
  
  console.log("\n🔗 Connecting to Polygon Amoy...");
  
  try {
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.getBalance();
    
    console.log("\n✅ Connection successful!");
    console.log("\n👤 Deployer Account:");
    console.log("   Address:", deployer.address);
    console.log("   Balance:", ethers.utils.formatEther(balance), "POL");
    
    const balanceNum = parseFloat(ethers.utils.formatEther(balance));
    
    if (balanceNum < 0.2) {
      console.log("\n⚠️  WARNING: Low balance!");
      console.log("   Recommended: At least 0.2 POL");
      console.log("   Get more from: https://faucet.polygon.technology/");
    } else {
      console.log("\n✅ Balance sufficient for deployment!");
    }
    
    console.log("\n🚀 Ready to deploy!");
    console.log("\nRun deployment:");
    console.log("   npx hardhat run scripts/deployAll.ts --network polygonAmoy\n");
    
  } catch (error: any) {
    console.log("\n❌ Connection failed!");
    console.log("Error:", error.message);
    console.log("\n💡 Check:");
    console.log("   - Private key is correct");
    console.log("   - Internet connection is working");
    console.log("   - RPC URL is accessible\n");
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

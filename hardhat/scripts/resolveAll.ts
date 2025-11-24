import { ethers } from "hardhat";

async function main() {
  const marketAddress = process.env.CONTRACT_ADDRESS || "";
  
  if (!marketAddress) {
    console.error("❌ Error: CONTRACT_ADDRESS not set in .env");
    process.exit(1);
  }
  
  const market = await ethers.getContractAt("PredictionMarketAION", marketAddress);
  
  // Resolve markets 2-11 with Bullish (0)
  for (let i = 2; i <= 11; i++) {
    try {
      console.log(`Resolving Market ${i}...`);
      const closeTx = await market.closeMarket(i);
      await closeTx.wait();
      const resolveTx = await market.resolveMarket(i, 0); // 0=Bullish
      await resolveTx.wait();
      console.log(`Market ${i} resolved: Bullish`);
    } catch (e) {
      console.log(`Market ${i} error:`, e.message);
    }
  }
}
main().catch((err) => { console.error(err); process.exit(1); });

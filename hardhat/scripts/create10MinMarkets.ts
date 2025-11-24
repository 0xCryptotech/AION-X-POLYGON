import { ethers } from "hardhat";

async function main() {
  const PREDICTION_MARKET_ADDRESS = "0x276c2de4D162875be9C9DF96f68dD80Be54E2838";
  
  const [deployer] = await ethers.getSigners();
  console.log("Creating 10-minute markets...");

  const market = await ethers.getContractAt("PredictionMarketAION", PREDICTION_MARKET_ADDRESS);
  const currentCount = await market.marketCount();
  
  // Create 20 markets with 10 MINUTE duration
  const currentTime = Math.floor(Date.now() / 1000);
  const closeTime = currentTime + 600; // 10 minutes

  const titles = [
    "BTC/USD: 10min Quick Battle",
    "ETH/USD: 10min Fast Trade", 
    "SOL/USD: 10min Prediction",
    "MATIC/USD: 10min Forecast",
    "XRP/USD: 10min Battle",
    "DOGE/USD: 10min Quick",
    "ADA/USD: 10min Fast",
    "MATIC/USD: 10min Trade",
    "AVAX/USD: 10min Battle",
    "DOT/USD: 10min Quick",
    "LINK/USD: 10min Fast",
    "UNI/USD: 10min Trade",
    "ATOM/USD: 10min Battle",
    "LTC/USD: 10min Quick",
    "BCH/USD: 10min Fast",
    "XLM/USD: 10min Trade",
    "TRX/USD: 10min Battle",
    "ETC/USD: 10min Quick",
    "FIL/USD: 10min Fast",
    "AAVE/USD: 10min Trade"
  ];

  console.log("\nCreating 20 markets with 10 minute duration...");
  console.log("Close time:", new Date(closeTime * 1000).toLocaleString());

  for (let i = 0; i < titles.length; i++) {
    try {
      const tx = await market.createMarket(
        titles[i],
        ["Bullish", "Bearish"],
        closeTime,
        deployer.address,
        0
      );
      await tx.wait();
      console.log(`✅ Market ${currentCount.toNumber() + i + 1}`);
    } catch (error: any) {
      console.log(`❌ Failed ${i + 1}:`, error.message);
    }
  }

  const newCount = await market.marketCount();
  console.log("\n✅ Done! Market IDs:", (currentCount.toNumber() + 1), "-", newCount.toNumber());
  console.log("⏰ Markets close in 10 minutes");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

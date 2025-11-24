import { ethers } from "hardhat";

async function main() {
  const PREDICTION_MARKET_ADDRESS = "0x276c2de4D162875be9C9DF96f68dD80Be54E2838";
  
  const [deployer] = await ethers.getSigners();
  console.log("Creating markets with 1 hour duration...");

  const market = await ethers.getContractAt("PredictionMarketAION", PREDICTION_MARKET_ADDRESS);

  const currentCount = await market.marketCount();
  console.log("Current market count:", currentCount.toNumber());

  // Create 20 markets with 1 HOUR duration for testing
  const currentTime = Math.floor(Date.now() / 1000);
  const closeTime = currentTime + 3600; // 1 hour

  const titles = [
    "BTC/USD: 1h Price Prediction",
    "ETH/USD: 1h Trend Forecast", 
    "SOL/USD: 1h Direction",
    "MATIC/USD: 1h Momentum",
    "XRP/USD: 1h Analysis",
    "DOGE/USD: 1h Prediction",
    "ADA/USD: 1h Forecast",
    "MATIC/USD: 1h Trend",
    "AVAX/USD: 1h Direction",
    "DOT/USD: 1h Analysis",
    "LINK/USD: 1h Prediction",
    "UNI/USD: 1h Forecast",
    "ATOM/USD: 1h Trend",
    "LTC/USD: 1h Direction",
    "BCH/USD: 1h Analysis",
    "XLM/USD: 1h Prediction",
    "TRX/USD: 1h Forecast",
    "ETC/USD: 1h Trend",
    "FIL/USD: 1h Direction",
    "AAVE/USD: 1h Analysis"
  ];

  console.log("\nCreating 20 markets with 1 hour duration...");
  console.log("Close time:", new Date(closeTime * 1000).toLocaleString());

  for (let i = 0; i < titles.length; i++) {
    try {
      const tx = await market.createMarket(
        titles[i],
        ["Bullish", "Bearish"],
        closeTime,
        deployer.address,
        0 // AI_VS_AI
      );
      await tx.wait();
      console.log(`✅ Market ${currentCount.toNumber() + i + 1}: ${titles[i]}`);
    } catch (error: any) {
      console.log(`❌ Failed ${i + 1}:`, error.message);
    }
  }

  const newCount = await market.marketCount();
  console.log("\n✅ Done! New market count:", newCount.toNumber());
  console.log("Market IDs:", (currentCount.toNumber() + 1), "-", newCount.toNumber());
  console.log("\n⏰ Markets will close in 1 hour");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

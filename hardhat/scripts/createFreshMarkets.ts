import { ethers } from "hardhat";

async function main() {
  const PREDICTION_MARKET_ADDRESS = "0x276c2de4D162875be9C9DF96f68dD80Be54E2838";
  
  const [deployer] = await ethers.getSigners();
  console.log("Creating fresh markets with account:", deployer.address);

  const market = await ethers.getContractAt("PredictionMarketAION", PREDICTION_MARKET_ADDRESS);

  // Check current market count
  const currentCount = await market.marketCount();
  console.log("\nCurrent market count:", currentCount.toNumber());

  // Create 20 new markets with 10 minute duration
  const currentTime = Math.floor(Date.now() / 1000);
  const closeTime = currentTime + 600; // 10 minutes from now

  const titles = [
    "BTC/USD: Will price go up in next 10 min?",
    "ETH/USD: Bullish or Bearish momentum?",
    "SOL/USD: Price prediction - Up or Down?",
    "MATIC/USD: Short-term trend forecast",
    "XRP/USD: Next 10 min direction?",
    "DOGE/USD: Meme coin rally continues?",
    "ADA/USD: Cardano surge incoming?",
    "MATIC/USD: Polygon price action",
    "AVAX/USD: Avalanche momentum check",
    "DOT/USD: Polkadot trend forecast",
    "LINK/USD: Chainlink price prediction",
    "UNI/USD: Uniswap trend analysis",
    "ATOM/USD: Cosmos price direction",
    "LTC/USD: Litecoin momentum",
    "BCH/USD: Bitcoin Cash forecast",
    "XLM/USD: Stellar price prediction",
    "TRX/USD: Tron trend analysis",
    "ETC/USD: Ethereum Classic direction",
    "FIL/USD: Filecoin momentum",
    "AAVE/USD: Aave price forecast"
  ];

  console.log("\nCreating 20 new markets...");
  console.log("Close time:", new Date(closeTime * 1000).toLocaleString());

  for (let i = 0; i < titles.length; i++) {
    try {
      const tx = await market.createMarket(
        titles[i],
        ["Bullish", "Bearish"],
        closeTime,
        deployer.address, // oracle
        0 // AI_VS_AI mode
      );
      await tx.wait();
      console.log(`✅ Market ${currentCount.toNumber() + i + 1}: ${titles[i]}`);
    } catch (error: any) {
      console.log(`❌ Failed to create market ${i + 1}:`, error.message);
    }
  }

  const newCount = await market.marketCount();
  console.log("\n✅ Markets created!");
  console.log("New market count:", newCount.toNumber());
  console.log("Market IDs:", (currentCount.toNumber() + 1), "-", newCount.toNumber());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

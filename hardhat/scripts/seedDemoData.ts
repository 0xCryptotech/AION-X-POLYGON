import { ethers } from "hardhat";

async function main() {
  const PREDICTION_MARKET_ADDRESS = process.env.CONTRACT_ADDRESS || "";
  const AION_TOKEN_ADDRESS = process.env.AION_TOKEN_ADDRESS || "";
  
  if (!PREDICTION_MARKET_ADDRESS || !AION_TOKEN_ADDRESS) {
    console.error("❌ Error: Contract addresses not set!");
    console.log("Please set CONTRACT_ADDRESS and AION_TOKEN_ADDRESS in .env");
    process.exit(1);
  }
  
  console.log("Using Prediction Market:", PREDICTION_MARKET_ADDRESS);
  console.log("Using AION Token:", AION_TOKEN_ADDRESS);
  
  const [deployer] = await ethers.getSigners();
  console.log("Seeding demo data with account:", deployer.address);

  const market = await ethers.getContractAt("PredictionMarketAION", PREDICTION_MARKET_ADDRESS);
  const aion = await ethers.getContractAt("AIONToken", AION_TOKEN_ADDRESS);

  // Demo wallets (use deployer for simplicity)
  const demoWallets = [
    { address: deployer.address, name: "Demo User 1" },
  ];

  console.log("\n=== Creating Demo Markets ===");
  
  const demoMarkets = [
    "BTC/USD: Will price exceed $105K in next 10 min?",
    "ETH/USD: Bullish or Bearish momentum next 10 min?",
    "SOL/USD: Price prediction - Up or Down?",
    "MATIC/USD: Short-term trend - Bull or Bear?",
    "XRP/USD: Next 10 min price direction?",
    "DOGE/USD: Meme coin rally - Yes or No?",
    "ADA/USD: Cardano surge incoming?",
    "MATIC/USD: Polygon price action prediction",
    "AVAX/USD: Avalanche momentum check",
    "DOT/USD: Polkadot trend forecast",
  ];

  const currentTime = Math.floor(Date.now() / 1000);
  const closeTime = currentTime + 600; // 10 minutes

  for (let i = 0; i < demoMarkets.length; i++) {
    try {
      const tx = await market.createMarket(demoMarkets[i], closeTime, 0); // mode 0 = AI vs AI
      await tx.wait();
      console.log(`✓ Created market: ${demoMarkets[i]}`);
    } catch (error: any) {
      console.log(`✗ Failed to create market ${i}: ${error.message}`);
    }
  }

  console.log("\n=== Placing Demo Bets ===");
  
  // Get current market count
  const marketCount = await market.marketCount();
  const startMarketId = marketCount.toNumber() - demoMarkets.length;

  // Place bets on 5 markets
  for (let i = 0; i < 5; i++) {
    const marketId = startMarketId + i;
    const outcome = i % 2; // Alternate between 0 and 1
    const amount = ethers.utils.parseEther("10");

    try {
      // Approve AION
      const approveTx = await aion.approve(PREDICTION_MARKET_ADDRESS, amount);
      await approveTx.wait();
      
      // Place bet
      const betTx = await market.placeBet(marketId, outcome, amount);
      await betTx.wait();
      
      console.log(`✓ Placed bet on market ${marketId}, outcome ${outcome}, amount 10 AION`);
    } catch (error: any) {
      console.log(`✗ Failed to place bet on market ${marketId}: ${error.message}`);
    }
  }

  console.log("\n=== Demo Data Seeding Complete ===");
  console.log(`Total markets created: ${demoMarkets.length}`);
  console.log(`Total bets placed: 5`);
  console.log(`\nNote: Markets will auto-resolve in 10 minutes via backend service`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

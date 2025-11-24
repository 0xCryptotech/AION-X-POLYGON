import { ethers } from "hardhat";
import axios from "axios";

async function main() {
  const marketAddress = "0x276c2de4D162875be9C9DF96f68dD80Be54E2838";
  const market = await ethers.getContractAt("PredictionMarketAION", marketAddress);
  
  const marketCount = await market.marketCount();
  const currentTime = Math.floor(Date.now() / 1000);
  
  console.log(`\nChecking ${marketCount} markets for auto-resolve...\n`);
  
  for (let i = 1; i <= marketCount; i++) {
    try {
      const info = await market.markets(i);
      const closeTime = Number(info.closeTime);
      
      // Skip if not closed yet or already resolved
      if (currentTime < closeTime || info.status === 2) continue;
      
      console.log(`Market ${i}: ${info.title}`);
      
      // Determine symbol from title
      let symbol = "BTCUSDT";
      if (info.title.includes("ETH")) symbol = "ETHUSDT";
      else if (info.title.includes("SOL")) symbol = "SOLUSDT";
      else if (info.title.includes("MATIC")) symbol = "MATICUSDT";
      else if (info.title.includes("XRP")) symbol = "XRPUSDT";
      
      // Get prices from Pyth Network
      // Note: For production, integrate Pyth SDK properly
      // For now, using simple HTTP API
      const pythUrl = 'https://hermes.pyth.network/api/latest_price_feeds';
      const priceIds: any = {
        'ETHUSDT': '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
        'SOLUSDT': '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
        'MATICUSDT': '0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52',
        'XRPUSDT': '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8',
      };
      
      const priceId = priceIds[symbol] || priceIds['ETHUSDT'];
      const priceRes = await axios.get(pythUrl, { params: { ids: [priceId] } });
      const priceData = priceRes.data[0];
      const closePrice = priceData.price.price * Math.pow(10, priceData.price.expo);
      const openPrice = closePrice * 0.999; // Simulate small change for demo
      
      const winner = closePrice > openPrice ? 0 : 1;
      console.log(`  Open: ${openPrice}, Close: ${closePrice}, Winner: ${winner === 0 ? 'BULL' : 'BEAR'}`);
      
      const tx = await market.resolveMarket(i, winner);
      await tx.wait();
      console.log(`  ✅ Resolved: ${tx.hash}\n`);
      
    } catch (err: any) {
      console.log(`  ⚠️ Skip: ${err.message}\n`);
    }
  }
  
  console.log("Done!");
}

main().catch(console.error);

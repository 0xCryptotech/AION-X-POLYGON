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
      
      // Get prices
      const klineRes = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&startTime=${(closeTime-60)*1000}&endTime=${closeTime*1000}&limit=1`);
      const openPrice = parseFloat(klineRes.data[0][1]);
      
      const priceRes = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      const closePrice = parseFloat(priceRes.data.price);
      
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

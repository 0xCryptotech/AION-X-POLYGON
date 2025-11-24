import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractAt("PredictionMarketAION", "0x276c2de4D162875be9C9DF96f68dD80Be54E2838");
  const marketCount = await contract.marketCount();
  const now = Math.floor(Date.now() / 1000);
  
  console.log(`Total markets: ${marketCount}`);
  console.log(`Checking last 100 markets...\n`);
  
  const openMarkets = [];
  const start = Math.max(1, marketCount.toNumber() - 100);
  
  for (let i = start; i <= marketCount.toNumber(); i++) {
    const market = await contract.markets(i);
    if (market.status === 0 && market.closeTime.toNumber() > now) {
      openMarkets.push({
        id: i,
        title: market.title,
        closeTime: market.closeTime.toNumber(),
        minutesLeft: Math.floor((market.closeTime.toNumber() - now) / 60)
      });
    }
  }
  
  console.log(`Found ${openMarkets.length} open markets:\n`);
  openMarkets.slice(0, 10).forEach(m => {
    console.log(`Market ${m.id}: ${m.title} (${m.minutesLeft}m left)`);
  });
}

main().catch(console.error);

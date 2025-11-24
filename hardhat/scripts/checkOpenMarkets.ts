import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractAt("PredictionMarketAION", "0x276c2de4D162875be9C9DF96f68dD80Be54E2838");
  const count = await contract.marketCount();
  console.log("Total markets:", count.toString());
  
  let openCount = 0;
  const now = Math.floor(Date.now() / 1000);
  const start = Math.max(1, count.toNumber() - 50);
  
  for (let i = start; i <= count.toNumber(); i++) {
    const m = await contract.markets(i);
    if (m.status === 0 && m.closeTime.toNumber() > now) {
      openCount++;
      console.log(`Market ${i}: ${m.title} (closes in ${Math.floor((m.closeTime.toNumber() - now)/60)}m)`);
    }
  }
  console.log(`\nOpen markets: ${openCount}`);
}

main().catch(console.error);

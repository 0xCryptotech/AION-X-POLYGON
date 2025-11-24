import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractAt("PredictionMarketAION", "0x276c2de4D162875be9C9DF96f68dD80Be54E2838");
  const userAddress = "0xa94d9728f3e25c5bfd4c0fc372eca4e631cae55d";
  const marketCount = await contract.marketCount();
  
  console.log(`Checking markets for ${userAddress}...`);
  
  let found = 0;
  for (let i = Math.max(1, marketCount.toNumber() - 30); i <= marketCount.toNumber(); i++) {
    const betsCount = await contract.getMarketBetsCount(i);
    for (let j = 0; j < betsCount.toNumber(); j++) {
      const bet = await contract.bets(i, j);
      if (bet.bettor.toLowerCase() === userAddress.toLowerCase()) {
        const market = await contract.markets(i);
        console.log(`\nMarket ${i}: ${market.title}`);
        console.log(`  Outcome: ${bet.outcome}`);
        console.log(`  Amount: ${ethers.utils.formatEther(bet.amount)} AION`);
        console.log(`  Status: ${market.status}`);
        found++;
      }
    }
  }
  console.log(`\nTotal bets found: ${found}`);
}

main().catch(console.error);

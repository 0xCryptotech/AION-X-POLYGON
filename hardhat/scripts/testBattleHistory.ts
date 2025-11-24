import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "";
  
  if (!contractAddress) {
    console.error("❌ Error: CONTRACT_ADDRESS not set in .env");
    process.exit(1);
  }
  
  const contract = await ethers.getContractAt("PredictionMarketAION", contractAddress);
  
  const userAddress = "0x489efd5015f07138f2fd6b3d428b48b2587cb440";
  const marketCount = await contract.marketCount();
  
  console.log("Total markets:", marketCount.toString());
  console.log("Fetching last 100 markets...\n");
  
  const startMarket = Math.max(1, marketCount.toNumber() - 100);
  let userBets = [];
  
  for (let marketId = startMarket; marketId <= marketCount.toNumber(); marketId++) {
    const betsCount = await contract.getMarketBetsCount(marketId);
    for (let i = 0; i < betsCount.toNumber(); i++) {
      const bet = await contract.bets(marketId, i);
      if (bet.bettor.toLowerCase() === userAddress.toLowerCase()) {
        const market = await contract.markets(marketId);
        userBets.push({
          marketId,
          title: market.title,
          status: ["OPEN", "CLOSED", "RESOLVED"][market.status],
          amount: ethers.utils.formatEther(bet.amount)
        });
      }
    }
  }
  
  console.log(`Found ${userBets.length} battles for user:\n`);
  userBets.forEach(bet => {
    console.log(`Market ${bet.marketId}: ${bet.title}`);
    console.log(`  Status: ${bet.status}, Amount: ${bet.amount} AION\n`);
  });
}

main().catch(console.error);

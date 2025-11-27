const { PrismaClient } = require('@prisma/client');
const { ethers } = require('ethers');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const prisma = new PrismaClient();

// Blockchain setup
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
const abiPath = __dirname + '/abi/PredictionMarket.json';
const contractJson = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const contractAbi = contractJson.abi || contractJson;
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

// Market configuration
const MARKET_DURATION = 60 * 60; // 60 minutes (1 hour) in seconds
const ASSETS = [
  { symbol: 'BTC/USD', emoji: '₿', name: 'Bitcoin' },
  { symbol: 'ETH/USD', emoji: 'Ξ', name: 'Ethereum' },
  { symbol: 'BNB/USD', emoji: '🔶', name: 'BNB' },
  { symbol: 'XRP/USD', emoji: '✕', name: 'Ripple' }
];

/**
 * Close expired markets in database
 */
async function closeExpiredMarkets() {
  try {
    const now = new Date();
    
    // Find all OPEN markets that have passed their closeTime
    const expiredMarkets = await prisma.market.findMany({
      where: {
        status: 'OPEN',
        closeTime: {
          lt: now
        }
      }
    });

    if (expiredMarkets.length === 0) {
      console.log('✓ No expired markets to close');
      return 0;
    }

    console.log(`📊 Found ${expiredMarkets.length} expired markets to close`);

    let closedCount = 0;
    for (const market of expiredMarkets) {
      try {
        // Update market status to CLOSED
        await prisma.market.update({
          where: { id: market.id },
          data: { status: 'CLOSED' }
        });

        console.log(`✓ Closed market #${market.id}: ${market.title}`);
        closedCount++;
      } catch (err) {
        console.error(`✗ Failed to close market #${market.id}:`, err.message);
      }
    }

    console.log(`✅ Successfully closed ${closedCount}/${expiredMarkets.length} markets`);
    return closedCount;
  } catch (error) {
    console.error('❌ Error closing expired markets:', error.message);
    return 0;
  }
}

/**
 * Create new markets if needed
 */
async function createNewMarkets() {
  try {
    // Check how many OPEN markets exist
    const openMarkets = await prisma.market.findMany({
      where: { status: 'OPEN' }
    });

    console.log(`📈 Current open markets: ${openMarkets.length}`);

    // If we have enough open markets, skip creation
    if (openMarkets.length >= ASSETS.length) {
      console.log('✓ Sufficient open markets available');
      return 0;
    }

    console.log(`🔨 Creating new markets for all assets...`);

    const closeTimeEpoch = Math.floor(Date.now() / 1000) + MARKET_DURATION;
    const closeTime = new Date(closeTimeEpoch * 1000);
    const outcomes = ['Bullish', 'Bearish'];
    const oracle = wallet.address;

    let createdCount = 0;

    for (const asset of ASSETS) {
      try {
        const title = `${asset.symbol}: 1hr Battle`;

        // Create on-chain market
        console.log(`⛓️  Creating on-chain market for ${asset.symbol}...`);
        const tx = await contract.createMarket(
          title,
          outcomes,
          closeTimeEpoch,
          oracle,
          0, // mode: AI_VS_AI
          {
            gasLimit: 300000,
            maxFeePerGas: ethers.utils.parseUnits('30', 'gwei'),
            maxPriorityFeePerGas: ethers.utils.parseUnits('30', 'gwei')
          }
        );

        const receipt = await tx.wait();
        console.log(`✓ On-chain market created: ${tx.hash}`);

        // Create in database
        const market = await prisma.market.create({
          data: {
            title,
            outcomes: JSON.stringify(outcomes),
            closeTime,
            mode: 'AI_VS_AI',
            status: 'OPEN',
            oracle
          }
        });

        console.log(`✅ Created market #${market.id}: ${title}`);
        createdCount++;

      } catch (err) {
        console.error(`✗ Failed to create market for ${asset.symbol}:`, err.message);
      }
    }

    console.log(`✅ Successfully created ${createdCount}/${ASSETS.length} new markets`);
    return createdCount;

  } catch (error) {
    console.error('❌ Error creating new markets:', error.message);
    return 0;
  }
}

/**
 * Main cron job function
 */
async function runCronJob() {
  console.log('\n' + '='.repeat(60));
  console.log(`🕐 Market Cron Job - ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));

  try {
    // Step 1: Close expired markets
    console.log('\n📌 Step 1: Closing expired markets...');
    const closedCount = await closeExpiredMarkets();

    // Step 2: Create new markets if needed
    console.log('\n📌 Step 2: Creating new markets...');
    const createdCount = await createNewMarkets();

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Cron job completed: ${closedCount} closed, ${createdCount} created`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Cron job failed:', error);
  }
}

// Run immediately on start
console.log('🚀 Market Cron Service Started');
console.log('⏰ Running every 1 minute...\n');

runCronJob();

// Run every 1 minute
setInterval(runCronJob, 60 * 1000);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

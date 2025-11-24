const { ethers } = require('ethers');
const axios = require('axios');

const PROVIDER_URL = 'https://bsc-testnet-rpc.publicnode.com';
const PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY || '0x608abfb3eca971cad75f35dd73b9ceb24edbe2ef259df72565f674b71f84170f';
const CONTRACT_ADDRESS = '0x276c2de4D162875be9C9DF96f68dD80Be54E2838';

const CONTRACT_ABI = [
  "function markets(uint256) view returns (string title, uint8 mode, uint256 closeTime, address oracle, uint8 status, uint256 totalStaked, uint256 winningOutcome)",
  "function closeMarket(uint256 marketId) external",
  "function resolveMarket(uint256 marketId, uint256 winningOutcome) external",
  "function marketCount() view returns (uint256)",
  "function createMarket(string calldata title, string[] calldata outcomes, uint closeTime, address oracle, uint8 mode) external returns (uint)"
];

const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Store battle start prices
const { getPythPrice } = require('./pythPriceService');

const battlePrices = new Map();

async function getPrice(symbol) {
  try {
    // Use Pyth Network for price feeds
    const price = await getPythPrice(symbol);
    return price;
  } catch (error) {
    console.error('Price fetch error:', error.message);
    return null;
  }
}

async function checkAndResolveMarkets() {
  try {
    const marketCount = await contract.marketCount();
    console.log(`Checking ${marketCount} markets...`);

    for (let i = 1; i <= marketCount; i++) {
      const market = await contract.markets(i);
      const [title, mode, closeTime, oracle, status, totalStaked, winningOutcome] = market;
      
      const now = Math.floor(Date.now() / 1000);
      
      // Status: 0=OPEN, 1=CLOSED, 2=RESOLVED
      // Resolve only when closeTime is reached
      if (status === 0 && now >= closeTime.toNumber()) {
        console.log(`Market ${i} ready to close`);
        
        // Close market
        const closeTx = await contract.closeMarket(i);
        await closeTx.wait();
        console.log(`Market ${i} closed`);
        
        // Get price and determine outcome
        const currentPrice = await getPrice('BTCUSDT');
        const startPrice = battlePrices.get(i) || currentPrice;
        
        const outcome = currentPrice > startPrice ? 0 : 1; // 0=Bullish, 1=Bearish
        
        // Resolve market
        const resolveTx = await contract.resolveMarket(i, outcome);
        await resolveTx.wait();
        
        console.log(`Market ${i} resolved: ${outcome === 0 ? 'Bullish' : 'Bearish'}`);
        console.log(`Start: ${startPrice}, End: ${currentPrice}`);
        
        battlePrices.delete(i);
      }
    }
  } catch (error) {
    console.error('Auto-resolve error:', error.message);
  }
}

// Store start price when market created
async function trackNewMarkets() {
  try {
    const marketCount = await contract.marketCount();
    for (let i = 1; i <= marketCount; i++) {
      if (!battlePrices.has(i)) {
        const price = await getPrice('BTCUSDT');
        battlePrices.set(i, price);
        console.log(`Tracking market ${i} start price: $${price} (Pyth Network)`);
      }
    }
  } catch (error) {
    console.error('Track markets error:', error.message);
  }
}

// Run every 5 seconds for fastest resolution
setInterval(async () => {
  await trackNewMarkets();
  await checkAndResolveMarkets();
}, 5000);

console.log('🤖 Auto-resolve service started');
console.log('⚡ Checking markets every 5 seconds for ultra-fast resolution...');

async function maintainMarketPool() {
  try {
    const marketCount = await contract.marketCount();
    let openCount = 0;
    const start = Math.max(1, marketCount.toNumber() - 50);
    for (let i = start; i <= marketCount.toNumber(); i++) {
      const market = await contract.markets(i);
      if (market.status === 0) openCount++;
    }
    console.log(`Open markets: ${openCount}`);
    if (openCount < 20) {
      console.log('Creating 20 new markets (4 batches of 5 assets)...');
      const closeTime = Math.floor(Date.now() / 1000) + 600;
      const outcomes = ['Bullish', 'Bearish'];
      const assets = [
        { name: 'BTC/USD', emoji: '₿' },
        { name: 'ETH/USD', emoji: 'Ξ' },
        { name: 'SOL/USD', emoji: '◎' },
        { name: 'MATIC/USD', emoji: '🔷' },
        { name: 'XRP/USD', emoji: '✕' }
      ];
      
      let created = 0;
      for (let batch = 0; batch < 4; batch++) {
        for (const asset of assets) {
          try {
            const tx = await contract.createMarket(
              `${asset.emoji} ${asset.name}: 10min Fast Trade`,
              outcomes,
              closeTime,
              wallet.address,
              0
            );
            await tx.wait();
            created++;
          } catch (err) {
            console.error(`Failed to create ${asset.name} market:`, err.message);
          }
        }
      }
      console.log(`✅ Created ${created} new markets!`);
    }
  } catch (error) {
    console.error('Maintain market pool error:', error.message);
  }
}

setInterval(maintainMarketPool, 60000);

trackNewMarkets();
checkAndResolveMarkets();
maintainMarketPool();

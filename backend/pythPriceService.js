// Pyth Network Price Service for Polygon
const axios = require('axios');

// Pyth Network Hermes API endpoint
const PYTH_HERMES_URL = 'https://hermes.pyth.network';

// Pyth Price Feed IDs for Polygon
const PRICE_FEED_IDS = {
  'BTCUSDT': '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD
  'ETHUSDT': '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // ETH/USD
  'SOLUSDT': '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', // SOL/USD
  'MATICUSDT': '0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52', // MATIC/USD
  'XRPUSDT': '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8', // XRP/USD
  'DOGEUSDT': '0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c', // DOGE/USD
  'ADAUSDT': '0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d', // ADA/USD
  'AVAXUSDT': '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7', // AVAX/USD
  'DOTUSDT': '0xca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b', // DOT/USD
  'LINKUSDT': '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221', // LINK/USD
};

/**
 * Get latest price from Pyth Network
 * @param {string} symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @returns {Promise<number>} - Latest price
 */
async function getPythPrice(symbol) {
  try {
    const priceId = PRICE_FEED_IDS[symbol];
    
    if (!priceId) {
      console.warn(`Price feed ID not found for ${symbol}, using fallback`);
      return null;
    }

    // Get latest price from Pyth Hermes
    const response = await axios.get(`${PYTH_HERMES_URL}/api/latest_price_feeds`, {
      params: {
        ids: [priceId],
      },
      timeout: 5000,
    });

    if (response.data && response.data.length > 0) {
      const priceData = response.data[0];
      const price = priceData.price.price;
      const expo = priceData.price.expo;
      
      // Calculate actual price: price * 10^expo
      const actualPrice = price * Math.pow(10, expo);
      
      console.log(`Pyth price for ${symbol}: $${actualPrice.toFixed(2)}`);
      return actualPrice;
    }

    throw new Error('No price data received');
  } catch (error) {
    console.error(`Error fetching Pyth price for ${symbol}:`, error.message);
    
    // Fallback to Binance if Pyth fails
    return await getBinancePriceFallback(symbol);
  }
}

/**
 * Fallback to Binance API if Pyth fails
 * @param {string} symbol - Trading pair symbol
 * @returns {Promise<number>} - Latest price
 */
async function getBinancePriceFallback(symbol) {
  try {
    console.log(`Using Binance fallback for ${symbol}`);
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`, {
      timeout: 5000,
    });
    return parseFloat(response.data.price);
  } catch (error) {
    console.error(`Binance fallback also failed for ${symbol}:`, error.message);
    throw new Error(`Failed to fetch price for ${symbol}`);
  }
}

/**
 * Get price at specific timestamp (for historical data)
 * @param {string} symbol - Trading pair symbol
 * @param {number} timestamp - Unix timestamp
 * @returns {Promise<number>} - Price at timestamp
 */
async function getPythPriceAtTime(symbol, timestamp) {
  try {
    const priceId = PRICE_FEED_IDS[symbol];
    
    if (!priceId) {
      console.warn(`Price feed ID not found for ${symbol}`);
      return null;
    }

    // Get price at specific time from Pyth
    const response = await axios.get(`${PYTH_HERMES_URL}/api/get_price_feed`, {
      params: {
        id: priceId,
        publish_time: timestamp,
      },
      timeout: 5000,
    });

    if (response.data) {
      const price = response.data.price.price;
      const expo = response.data.price.expo;
      return price * Math.pow(10, expo);
    }

    throw new Error('No historical price data');
  } catch (error) {
    console.error(`Error fetching historical Pyth price:`, error.message);
    // Fallback to current price if historical not available
    return await getPythPrice(symbol);
  }
}

/**
 * Get multiple prices at once
 * @param {string[]} symbols - Array of trading pair symbols
 * @returns {Promise<Object>} - Object with symbol: price pairs
 */
async function getMultiplePythPrices(symbols) {
  const priceIds = symbols
    .map(symbol => PRICE_FEED_IDS[symbol])
    .filter(id => id !== undefined);

  if (priceIds.length === 0) {
    return {};
  }

  try {
    const response = await axios.get(`${PYTH_HERMES_URL}/api/latest_price_feeds`, {
      params: {
        ids: priceIds,
      },
      timeout: 5000,
    });

    const prices = {};
    response.data.forEach((priceData, index) => {
      const symbol = symbols[index];
      const price = priceData.price.price;
      const expo = priceData.price.expo;
      prices[symbol] = price * Math.pow(10, expo);
    });

    return prices;
  } catch (error) {
    console.error('Error fetching multiple Pyth prices:', error.message);
    return {};
  }
}

module.exports = {
  getPythPrice,
  getPythPriceAtTime,
  getMultiplePythPrices,
  PRICE_FEED_IDS,
};

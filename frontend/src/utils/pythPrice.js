// Pyth Network Price Feed Integration for Frontend
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';

// Pyth Price Service endpoint
const PYTH_PRICE_SERVICE = 'https://hermes.pyth.network';

// Pyth Price Feed IDs
export const PYTH_PRICE_FEEDS = {
  'btcusdt': '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD
  'ethusdt': '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // ETH/USD
  'solusdt': '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', // SOL/USD
  'maticusdt': '0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52', // MATIC/USD
  'xrpusdt': '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8', // XRP/USD
  'dogeusdt': '0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c', // DOGE/USD
  'adausdt': '0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d', // ADA/USD
  'avaxusdt': '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7', // AVAX/USD
  'dotusdt': '0xca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b', // DOT/USD
  'linkusdt': '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221', // LINK/USD
};

/**
 * Create Pyth price service connection
 */
export function createPythConnection() {
  return new EvmPriceServiceConnection(PYTH_PRICE_SERVICE);
}

/**
 * Get latest price from Pyth Network
 * @param {string} symbol - Trading pair symbol (e.g., 'btcusdt')
 * @returns {Promise<number>} - Latest price
 */
export async function getPythPrice(symbol) {
  try {
    const priceId = PYTH_PRICE_FEEDS[symbol.toLowerCase()];
    
    if (!priceId) {
      console.warn(`Price feed not found for ${symbol}`);
      return null;
    }

    const response = await fetch(`${PYTH_PRICE_SERVICE}/api/latest_price_feeds?ids[]=${priceId}`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      const priceData = data[0];
      const price = priceData.price.price;
      const expo = priceData.price.expo;
      const conf = priceData.price.conf;
      
      // Calculate actual price
      const actualPrice = price * Math.pow(10, expo);
      const confidence = conf * Math.pow(10, expo);
      
      return {
        price: actualPrice,
        confidence: confidence,
        timestamp: priceData.price.publish_time,
      };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching Pyth price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Subscribe to real-time price updates using WebSocket
 * @param {string} symbol - Trading pair symbol
 * @param {Function} callback - Callback function to handle price updates
 * @returns {Function} - Unsubscribe function
 */
export function subscribeToPythPrice(symbol, callback) {
  const priceId = PYTH_PRICE_FEEDS[symbol.toLowerCase()];
  
  if (!priceId) {
    console.warn(`Price feed not found for ${symbol}`);
    return () => {};
  }

  // Use Pyth WebSocket for real-time updates
  const ws = new WebSocket(`wss://hermes.pyth.network/ws`);
  
  ws.onopen = () => {
    // Subscribe to price feed
    ws.send(JSON.stringify({
      type: 'subscribe',
      ids: [priceId],
    }));
    console.log(`Subscribed to Pyth price feed for ${symbol}`);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === 'price_update') {
        const priceData = data.price_feed;
        const price = priceData.price.price;
        const expo = priceData.price.expo;
        const actualPrice = price * Math.pow(10, expo);
        
        callback({
          price: actualPrice,
          timestamp: priceData.price.publish_time,
          symbol: symbol,
        });
      }
    } catch (error) {
      console.error('Error parsing Pyth WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('Pyth WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log(`Disconnected from Pyth price feed for ${symbol}`);
  };

  // Return unsubscribe function
  return () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'unsubscribe',
        ids: [priceId],
      }));
    }
    ws.close();
  };
}

/**
 * Simple HTTP polling for price updates (fallback)
 * @param {string} symbol - Trading pair symbol
 * @param {Function} callback - Callback function
 * @param {number} interval - Polling interval in ms (default: 1000)
 * @returns {Function} - Stop polling function
 */
export function pollPythPrice(symbol, callback, interval = 1000) {
  let isPolling = true;
  
  const poll = async () => {
    while (isPolling) {
      const priceData = await getPythPrice(symbol);
      if (priceData) {
        callback(priceData);
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  };
  
  poll();
  
  // Return stop function
  return () => {
    isPolling = false;
  };
}

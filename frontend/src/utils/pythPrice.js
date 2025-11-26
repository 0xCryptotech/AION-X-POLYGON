// Pyth Network Price Service
const PYTH_ENDPOINT = 'https://hermes.pyth.network/api/latest_price_feeds';

const PRICE_IDS = {
  'BTCUSDT': '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  'ETHUSDT': '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  'BNBUSDT': '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
  'SOLUSDT': '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  'XRPUSDT': '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8'
};

export const getPythPrice = async (symbol) => {
  try {
    const priceId = PRICE_IDS[symbol.toUpperCase()];
    if (!priceId) return null;

    const response = await fetch(`${PYTH_ENDPOINT}?ids[]=${priceId}`);
    const data = await response.json();
    
    if (!data || !data[0]) return null;

    const priceData = data[0].price;
    const price = parseFloat(priceData.price) * Math.pow(10, priceData.expo);
    
    return { price, conf: 0, publishTime: priceData.publish_time };
  } catch (e) {
    console.error('Pyth error:', e);
    return null;
  }
};

export const subscribeToPythPrice = (symbol, callback) => {
  const interval = setInterval(async () => {
    const data = await getPythPrice(symbol);
    if (data) callback(data);
  }, 3000);

  return () => clearInterval(interval);
};

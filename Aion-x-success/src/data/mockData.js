import { getPythPrice } from '@/utils/pythPrice';

// Extract symbol from title
const extractSymbol = (title) => {
  if (title.includes('BTC')) return 'BTCUSDT';
  if (title.includes('ETH')) return 'ETHUSDT';
  if (title.includes('SOL')) return 'SOLUSDT';
  if (title.includes('BNB')) return 'BNBUSDT';
  if (title.includes('XRP')) return 'XRPUSDT';
  return null;
};

// Enrich markets with live price
export const enrichMarketsWithPrice = async (markets) => {
  const enriched = await Promise.all(
    markets.map(async (market) => {
      const symbol = extractSymbol(market.title);
      if (symbol) {
        const priceData = await getPythPrice(symbol);
        return { ...market, livePrice: priceData?.price, symbol };
      }
      return market;
    })
  );
  return enriched;
};

// Mock market data - Enhanced demo
export const mockMarkets = [
  {
    id: 1,
    title: '🚀 BTC/USD: Will Bitcoin break $105K in next 10 minutes?',
    mode: 'AI_VS_AI',
    closeTime: Date.now() + 1000 * 60 * 10,
    status: 'OPEN',
    outcomes: [
      { name: 'Bullish 📈', pool: 245.8 },
      { name: 'Bearish 📉', pool: 198.3 },
    ],
    participants: 127,
  },
  {
    id: 2,
    title: '⚡ ETH/USD: Ethereum momentum - Bull or Bear?',
    mode: 'AI_VS_HUMAN',
    closeTime: Date.now() + 1000 * 60 * 10,
    status: 'OPEN',
    outcomes: [
      { name: 'Bullish 📈', pool: 189.2 },
      { name: 'Bearish 📉', pool: 156.7 },
    ],
    participants: 94,
  },
  {
    id: 3,
    title: '🌟 SOL/USD: Solana price surge incoming?',
    mode: 'AI_VS_AI',
    closeTime: Date.now() + 1000 * 60 * 10,
    status: 'OPEN',
    outcomes: [
      { name: 'Bullish 📈', pool: 167.4 },
      { name: 'Bearish 📉', pool: 143.9 },
    ],
    participants: 78,
  },
  {
    id: 4,
    title: '💎 BNB/USD: Binance Coin trend prediction',
    mode: 'HUMAN_VS_HUMAN',
    closeTime: Date.now() + 1000 * 60 * 10,
    status: 'OPEN',
    outcomes: [
      { name: 'Bullish 📈', pool: 134.6 },
      { name: 'Bearish 📉', pool: 112.8 },
    ],
    participants: 65,
  },
  {
    id: 5,
    title: '🎯 XRP/USD: Ripple breakout or breakdown?',
    mode: 'AI_VS_HUMAN',
    closeTime: Date.now() + 1000 * 60 * 10,
    status: 'OPEN',
    outcomes: [
      { name: 'Bullish 📈', pool: 156.3 },
      { name: 'Bearish 📉', pool: 128.5 },
    ],
    participants: 71,
  },
  {
    id: 6,
    title: '🐕 DOGE/USD: Meme coin rally continues?',
    mode: 'AI_VS_AI',
    closeTime: Date.now() + 1000 * 60 * 10,
    status: 'OPEN',
    outcomes: [
      { name: 'Bullish 📈', pool: 98.7 },
      { name: 'Bearish 📉', pool: 87.2 },
    ],
    participants: 52,
  },
  {
    id: 7,
    title: '🔷 ADA/USD: Cardano momentum check',
    mode: 'HUMAN_VS_HUMAN',
    closeTime: Date.now() + 1000 * 60 * 10,
    status: 'OPEN',
    outcomes: [
      { name: 'Bullish 📈', pool: 112.4 },
      { name: 'Bearish 📉', pool: 95.8 },
    ],
    participants: 58,
  },
  {
    id: 8,
    title: '🟣 MATIC/USD: Polygon price action forecast',
    mode: 'AI_VS_HUMAN',
    closeTime: Date.now() + 1000 * 60 * 10,
    status: 'OPEN',
    outcomes: [
      { name: 'Bullish 📈', pool: 87.9 },
      { name: 'Bearish 📉', pool: 76.3 },
    ],
    participants: 45,
  },
  {
    id: 9,
    title: '🔺 AVAX/USD: Avalanche trend prediction',
    mode: 'AI_VS_AI',
    closeTime: Date.now() + 1000 * 60 * 10,
    status: 'OPEN',
    outcomes: [
      { name: 'Bullish 📈', pool: 76.5 },
      { name: 'Bearish 📉', pool: 68.2 },
    ],
    participants: 39,
  },
  {
    id: 10,
    title: '⚪ DOT/USD: Polkadot momentum analysis',
    mode: 'HUMAN_VS_HUMAN',
    closeTime: Date.now() + 1000 * 60 * 10,
    status: 'OPEN',
    outcomes: [
      { name: 'Bullish 📈', pool: 65.8 },
      { name: 'Bearish 📉', pool: 58.4 },
    ],
    participants: 34,
  },
];

// Get markets with live prices
export const getMarketsWithLivePrice = async () => {
  return await enrichMarketsWithPrice(mockMarkets);
};

// Mock leaderboard data - Enhanced demo
export const mockLeaderboard = [
  {
    rank: 1,
    address: '0xa94d...e55d',
    totalBets: 342,
    winRate: 73.8,
    totalEarnings: 1847.6,
  },
  {
    rank: 2,
    address: '0x489e...cb440',
    totalBets: 298,
    winRate: 71.2,
    totalEarnings: 1523.4,
  },
  {
    rank: 3,
    address: '0xC3Ec...3974',
    totalBets: 267,
    winRate: 68.9,
    totalEarnings: 1289.7,
  },
  {
    rank: 4,
    address: '0x1a2b...3c4d',
    totalBets: 234,
    winRate: 66.5,
    totalEarnings: 1045.3,
  },
  {
    rank: 5,
    address: '0x5e6f...7g8h',
    totalBets: 215,
    winRate: 64.2,
    totalEarnings: 892.8,
  },
  {
    rank: 6,
    address: '0x9i0j...1k2l',
    totalBets: 198,
    winRate: 62.1,
    totalEarnings: 756.4,
  },
  {
    rank: 7,
    address: '0x3m4n...5o6p',
    totalBets: 187,
    winRate: 60.8,
    totalEarnings: 687.2,
  },
  {
    rank: 8,
    address: '0x7q8r...9s0t',
    totalBets: 176,
    winRate: 59.3,
    totalEarnings: 623.5,
  },
  {
    rank: 9,
    address: '0x2u3v...4w5x',
    totalBets: 165,
    winRate: 57.9,
    totalEarnings: 567.8,
  },
  {
    rank: 10,
    address: '0x6y7z...8a9b',
    totalBets: 154,
    winRate: 56.5,
    totalEarnings: 512.3,
  },
];

// Mock portfolio data - Enhanced demo
export const mockPortfolio = {
  totalBets: 87,
  activeBets: 12,
  wonBets: 54,
  lostBets: 21,
  totalInvested: 870.0,
  totalEarnings: 1245.8,
  profitLoss: 375.8,
  winRate: 62.1,
  activeBetsDetails: [
    {
      marketId: 1,
      title: '🚀 BTC/USD: Will Bitcoin break $105K in next 10 minutes?',
      outcome: 'Bullish 📈',
      amount: 25.0,
      potentialReturn: 48.5,
      closeTime: Date.now() + 1000 * 60 * 10,
    },
    {
      marketId: 2,
      title: '⚡ ETH/USD: Ethereum momentum - Bull or Bear?',
      outcome: 'Bullish 📈',
      amount: 20.0,
      potentialReturn: 38.2,
      closeTime: Date.now() + 1000 * 60 * 10,
    },
    {
      marketId: 3,
      title: '🌟 SOL/USD: Solana price surge incoming?',
      outcome: 'Bearish 📉',
      amount: 15.0,
      potentialReturn: 28.7,
      closeTime: Date.now() + 1000 * 60 * 10,
    },
    {
      marketId: 5,
      title: '🎯 XRP/USD: Ripple breakout or breakdown?',
      outcome: 'Bullish 📈',
      amount: 18.0,
      potentialReturn: 34.4,
      closeTime: Date.now() + 1000 * 60 * 10,
    },
    {
      marketId: 6,
      title: '🐕 DOGE/USD: Meme coin rally continues?',
      outcome: 'Bullish 📈',
      amount: 12.0,
      potentialReturn: 22.9,
      closeTime: Date.now() + 1000 * 60 * 10,
    },
  ],
};

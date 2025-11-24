# Demo Data Seeding Guide

## Overview
This guide explains how to seed demo data for AION-X presentations and testing.

## What Gets Seeded

### 1. Smart Contract Data (On-Chain)
- **10 New Markets**: Crypto prediction markets (BTC, ETH, SOL, etc.)
- **5 Demo Bets**: Pre-placed bets for battle history
- **Market Duration**: 10 minutes for fast resolution

### 2. Frontend Mock Data (Already Updated)
- **Enhanced Markets**: 10 markets with realistic pools ($200-400 AION)
- **Leaderboard**: 10 traders with 850+ total users
- **Portfolio Stats**: 87 bets, 62% win rate, 375 AION profit
- **Battle History**: Shows resolved battles with win/loss

## Quick Start

### Option 1: Run Seeding Script (Recommended)
```bash
cd /Users/idcuq/Documents/DORAHACKS/app-main
./seed-demo.sh
```

### Option 2: Manual Seeding
```bash
cd hardhat
npx hardhat run scripts/seedDemoData.ts --network bscTestnet
```

## What Happens During Seeding

1. **Creates 10 Markets**:
   - BTC/USD: Will price exceed $105K in next 10 min?
   - ETH/USD: Bullish or Bearish momentum next 10 min?
   - SOL/USD: Price prediction - Up or Down?
   - MATIC/USD: Short-term trend - Bull or Bear?
   - XRP/USD: Next 10 min price direction?
   - DOGE/USD: Meme coin rally - Yes or No?
   - ADA/USD: Cardano surge incoming?
   - AVAX/USD: Avalanche momentum check
   - DOT/USD: Polkadot trend forecast
   - LINK/USD: Chainlink price prediction

2. **Places 5 Demo Bets**:
   - Market 1: Outcome 0 (Bullish), 10 AION
   - Market 2: Outcome 1 (Bearish), 10 AION
   - Market 3: Outcome 0 (Bullish), 10 AION
   - Market 4: Outcome 1 (Bearish), 10 AION
   - Market 5: Outcome 0 (Bullish), 10 AION

3. **Auto-Resolution**:
   - Backend checks every 5 seconds
   - Markets resolve after 10 minutes
   - Winners receive stake + profit
   - Losers lose their stake

## Prerequisites

### Required:
- Node.js installed
- Hardhat configured
- Polygon Amoy Testnet RPC access
- Deployer wallet with private key in `.env`
- 50+ AION tokens in deployer wallet

### Environment Variables:
```bash
# hardhat/.env
PRIVATE_KEY=0x608abfb3eca971cad75f35dd73b9ceb24edbe2ef259df72565f674b71f84170f
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
```

## Verification

### Check Markets Created:
```bash
cd hardhat
npx hardhat run scripts/checkMarkets.ts --network polygonAmoy
```

### Check Battle History:
```bash
cd hardhat
npx hardhat run scripts/testBattleHistory.ts --network polygonAmoy
```

### Check Frontend:
1. Visit https://aion-x.vercel.app/
2. Connect wallet (0xC3EcE9AC328CB232dDB0BC677d2e980a1a3D3974)
3. Go to Portfolio page
4. Verify battle history shows 5 new battles

## Troubleshooting

### Error: "Insufficient AION balance"
**Solution**: Get more AION from faucet
```bash
cd hardhat
npx hardhat run scripts/deployFaucet.ts --network polygonAmoy
```

### Error: "Market creation failed"
**Solution**: Check deployer wallet has enough MATIC for gas
- Need ~0.01 MATIC for 10 market creations

### Error: "Bet placement failed"
**Solution**: Ensure AION approval is working
- Script automatically approves before betting
- Check AION token contract is correct

### Markets not resolving
**Solution**: Verify backend is running
```bash
ssh root@152.42.199.50
pm2 status
pm2 logs aion-backend
```

## Demo Data Summary

### Mock Data (Frontend Only)
| Metric | Value |
|--------|-------|
| Total Users | 850+ |
| Total Volume | $1.2M+ |
| Active Markets | 10 |
| Top Win Rate | 73.8% |
| Avg Win Rate | 62% |
| Pool Size | $200-400 AION |

### Real Data (On-Chain)
| Metric | Value |
|--------|-------|
| Markets Created | 10 per seeding |
| Bets Placed | 5 per seeding |
| Battle Duration | 10 minutes |
| Resolution Time | 5-15 seconds |
| Stake Amount | 10 AION per bet |

## Best Practices

### Before Demo:
1. ✅ Run seeding 1 hour before demo
2. ✅ Wait for 2-3 markets to resolve
3. ✅ Verify Portfolio shows battle history
4. ✅ Test one live battle end-to-end
5. ✅ Clear browser cache for fresh UI

### During Demo:
1. ✅ Show Homepage with 10 active markets
2. ✅ Start a new AI vs AI battle (BTC/USD)
3. ✅ Show Portfolio with resolved battles
4. ✅ Demonstrate withdraw functionality
5. ✅ Highlight leaderboard rankings

### After Demo:
1. ✅ Keep backend running for auto-resolution
2. ✅ Monitor PM2 logs for errors
3. ✅ Check Vercel deployment status
4. ✅ Verify new markets are auto-created

## Maintenance

### Auto-Create Markets
Backend automatically creates 10 new markets when open count drops below 20:
- Runs every 5 minutes
- Maintains pool of available markets
- No manual intervention needed

### Clean Up Old Markets
To reset for fresh demo:
```bash
# This will create new markets 82-91
cd hardhat
npx hardhat run scripts/seedDemoData.ts --network bscTestnet
```

## Support

### Issues?
1. Check backend logs: `ssh root@152.42.199.50 && pm2 logs aion-backend`
2. Verify contract addresses in `.env`
3. Ensure wallet has AION and BNB
4. Test with smaller amounts first

### Questions?
- See TESTING_GUIDE.md for manual testing steps
- Check PROBLEM_3_SUMMARY.md for overview

---

**Remember**: Seeding creates real on-chain data. Use testnet only!

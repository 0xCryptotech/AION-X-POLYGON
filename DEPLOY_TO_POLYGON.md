# 🚀 Deploy AION-X to Polygon Amoy Testnet

## Prerequisites

### 1. Get Test MATIC
- Visit: https://faucet.polygon.technology/
- Select: Polygon Amoy Testnet
- Enter your wallet address
- Claim test MATIC (you need ~0.5 MATIC for deployment)

### 2. Setup Environment
```bash
cd hardhat
cp .env.example .env
nano .env
```

Update `.env` with your private key:
```
PROVIDER_URL=https://rpc-amoy.polygon.technology/
OWNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

⚠️ **IMPORTANT**: Never commit your private key to git!

### 3. Install Dependencies
```bash
npm install
```

---

## Deployment Steps

### Step 1: Deploy All Contracts (One Command!)

```bash
npx hardhat run scripts/deployAll.ts --network polygonAmoy
```

**This will:**
1. Deploy AION Token (1 Billion supply)
2. Deploy Prediction Market (with 2% fee)
3. Deploy Staking Contract (revenue sharing)
4. Deploy Faucet (100 AION per claim)
5. Setup integration between contracts
6. Fund faucet with 100,000 AION

**Expected Output:**
```
🚀 Starting AION-X Deployment on Polygon Amoy...

Deploying contracts with account: 0x...
Account balance: 0.5 MATIC

📝 Step 1/4: Deploying AION Token...
✅ AION Token deployed to: 0xABC...
   Total Supply: 1,000,000,000 AION

📝 Step 2/4: Deploying Prediction Market...
✅ Prediction Market deployed to: 0xDEF...
   Platform Fee: 2%

📝 Step 3/4: Deploying Staking Contract...
✅ Staking Contract deployed to: 0xGHI...
   Min Stake: 100 AION
   Lock Period: 7 days

📝 Step 4/4: Deploying Faucet...
✅ Faucet deployed to: 0xJKL...
   Claim Amount: 100 AION per 24h

🔗 Setting up contract integration...
✅ Market -> Staking integration set
✅ Staking -> Market integration set

💰 Funding Faucet with 100,000 AION...
✅ Faucet funded

============================================================
🎉 DEPLOYMENT COMPLETE!
============================================================

📋 Contract Addresses:
   AION Token:         0xABC...
   Prediction Market:  0xDEF...
   Staking Contract:   0xGHI...
   Faucet:             0xJKL...
```

### Step 2: Save Contract Addresses

**IMPORTANT**: Copy all contract addresses and save them!

Update `hardhat/.env`:
```bash
AION_TOKEN_ADDRESS=0xABC...
CONTRACT_ADDRESS=0xDEF...
STAKING_ADDRESS=0xGHI...
FAUCET_ADDRESS=0xJKL...
```

---

## Post-Deployment Configuration

### Step 3: Update Backend

```bash
cd ../backend
nano .env
```

Update with your contract addresses:
```
PROVIDER_URL=https://rpc-amoy.polygon.technology/
OWNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
CONTRACT_ADDRESS=0xDEF...
PORT=4000
```

Copy contract ABI:
```bash
cp ../hardhat/artifacts/contracts/PredictionMarketAION.sol/PredictionMarketAION.json ./abi/PredictionMarket.json
```

### Step 4: Update Frontend

```bash
cd ../frontend
nano .env
```

Update with your contract addresses:
```
VITE_CONTRACT_ADDRESS=0xDEF...
VITE_TOKEN_ADDRESS=0xABC...
VITE_STAKING_ADDRESS=0xGHI...
VITE_FAUCET_ADDRESS=0xJKL...
VITE_BACKEND_URL=http://localhost:4000
VITE_CHAIN_ID=80002
```

---

## Verification on PolygonScan

Verify your contracts to make them publicly readable:

```bash
cd hardhat

# Verify Token
npx hardhat verify --network polygonAmoy 0xABC...

# Verify Market
npx hardhat verify --network polygonAmoy 0xDEF... 0xABC...

# Verify Staking
npx hardhat verify --network polygonAmoy 0xGHI... 0xABC...

# Verify Faucet
npx hardhat verify --network polygonAmoy 0xJKL... 0xABC...
```

**View on PolygonScan:**
- Token: https://amoy.polygonscan.com/address/0xABC...
- Market: https://amoy.polygonscan.com/address/0xDEF...
- Staking: https://amoy.polygonscan.com/address/0xGHI...
- Faucet: https://amoy.polygonscan.com/address/0xJKL...

---

## Create Test Markets

```bash
cd hardhat
npx hardhat run scripts/seedDemoData.ts --network polygonAmoy
```

This creates 10 test markets:
- BTC/USD, ETH/USD, SOL/USD, MATIC/USD, XRP/USD
- DOGE/USD, ADA/USD, AVAX/USD, DOT/USD, LINK/USD

---

## Start Application

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3: Open Browser
```bash
open http://localhost:3000
```

---

## Testing Checklist

### ✅ Test Faucet
1. Connect MetaMask to Polygon Amoy
2. Go to Faucet page
3. Click "Claim 100 AION"
4. Verify transaction on PolygonScan
5. Check AION balance

### ✅ Test Battle
1. Go to Battle page
2. Select a market
3. Choose outcome
4. Enter bet amount (min 10 AION)
5. Approve AION token
6. Confirm bet
7. Wait for market to close (10 min)
8. Check Portfolio for rewards

### ✅ Test Staking
1. Go to Staking page
2. Enter stake amount (min 100 AION)
3. Approve and stake
4. Verify staking transaction
5. Check staking balance

---

## Troubleshooting

### Error: "Insufficient funds for gas"
**Solution**: Get more MATIC from faucet
- https://faucet.polygon.technology/

### Error: "Contract deployment failed"
**Check:**
- Private key is correct in .env
- Wallet has enough MATIC (need ~0.5 MATIC)
- RPC URL is correct
- Network is Polygon Amoy (80002)

### Error: "Transaction underpriced"
**Solution**: Increase gas price in hardhat.config.ts:
```typescript
networks: {
  polygonAmoy: {
    url: process.env.PROVIDER_URL,
    chainId: 80002,
    accounts: process.env.OWNER_PRIVATE_KEY ? [process.env.OWNER_PRIVATE_KEY] : [],
    gasPrice: 50000000000, // 50 gwei
  }
}
```

### Error: "Nonce too high"
**Solution**: Reset MetaMask account
- Settings > Advanced > Reset Account

---

## Cost Breakdown

| Item | Gas | Cost @ 30 gwei | Cost @ $1 MATIC |
|------|-----|----------------|-----------------|
| Deploy Token | 1,000,000 | 0.03 MATIC | $0.03 |
| Deploy Market | 2,500,000 | 0.075 MATIC | $0.075 |
| Deploy Staking | 2,000,000 | 0.06 MATIC | $0.06 |
| Deploy Faucet | 800,000 | 0.024 MATIC | $0.024 |
| Setup Integration | 200,000 | 0.006 MATIC | $0.006 |
| Fund Faucet | 100,000 | 0.003 MATIC | $0.003 |
| **TOTAL** | **~6,600,000** | **~0.198 MATIC** | **~$0.198** |

**Very cheap on Polygon! 🎉**

---

## Next Steps After Deployment

1. ✅ Update all documentation with contract addresses
2. ✅ Test all features thoroughly
3. ✅ Monitor gas costs
4. ✅ Set up backend monitoring
5. ✅ Deploy frontend to Vercel/Netlify
6. ✅ Deploy backend to VPS
7. ✅ Set up domain name
8. ✅ Enable SSL certificate

---

## Production Deployment

⚠️ **Before deploying to mainnet:**

1. **Security Audit**: Get professional audit
2. **Multi-sig**: Use multi-sig for owner role
3. **Timelock**: Add timelock for critical functions
4. **Testing**: Comprehensive test suite
5. **Insurance**: Consider smart contract insurance
6. **Bug Bounty**: Set up bug bounty program

---

## Support

- **Polygon Docs**: https://docs.polygon.technology/
- **Hardhat Docs**: https://hardhat.org/docs
- **GitHub Issues**: https://github.com/IdcuqS07/Aion-x/issues

---

**Good luck with your deployment! 🚀**

**Network**: Polygon Amoy Testnet
**Chain ID**: 80002
**Explorer**: https://amoy.polygonscan.com/

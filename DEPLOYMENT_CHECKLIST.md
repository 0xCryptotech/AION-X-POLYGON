# 🚀 AION-X Deployment Checklist - Polygon Amoy

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Node.js installed (v16+)
- [ ] Hardhat dependencies installed (`cd hardhat && npm install`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)

### 2. Wallet Setup
- [ ] MetaMask installed
- [ ] Polygon Amoy Testnet added to MetaMask
  - Network Name: Polygon Amoy Testnet
  - RPC URL: https://rpc-amoy.polygon.technology/
  - Chain ID: 80002
  - Currency: MATIC
  - Explorer: https://amoy.polygonscan.com/
- [ ] Test MATIC claimed from faucet (https://faucet.polygon.technology/)
- [ ] Private key exported dan disimpan aman

### 3. Configuration Files
- [ ] `hardhat/.env` created with:
  ```
  PROVIDER_URL=https://rpc-amoy.polygon.technology/
  OWNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
  ```
- [ ] Verify hardhat config network: `polygonAmoy`

---

## Deployment Steps

### Step 1: Deploy All Contracts (One Command!)
```bash
cd hardhat
npx hardhat run scripts/deployAll.ts --network polygonAmoy
```

**Expected Output:**
```
✅ AION Token deployed to: 0x...
✅ Prediction Market deployed to: 0x...
✅ Staking Contract deployed to: 0x...
✅ Faucet deployed to: 0x...
```

**Save these addresses!** ⚠️

- [ ] AION Token Address: `_________________`
- [ ] Prediction Market Address: `_________________`
- [ ] Staking Contract Address: `_________________`
- [ ] Faucet Address: `_________________`

---

### Step 2: Update Backend Configuration

#### 2.1 Update .env
```bash
cd ../backend
nano .env
```

Update dengan addresses dari deployment:
```
PROVIDER_URL=https://rpc-amoy.polygon.technology/
OWNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
CONTRACT_ADDRESS=<PREDICTION_MARKET_ADDRESS>
PORT=4000
```

- [ ] Backend .env updated

#### 2.2 Copy Contract ABI
```bash
cp ../hardhat/artifacts/contracts/PredictionMarketAION.sol/PredictionMarketAION.json ./abi/PredictionMarket.json
```

- [ ] ABI copied to backend

---

### Step 3: Update Frontend Configuration

```bash
cd ../frontend
nano .env
```

Update dengan addresses dari deployment:
```
VITE_CONTRACT_ADDRESS=<PREDICTION_MARKET_ADDRESS>
VITE_TOKEN_ADDRESS=<AION_TOKEN_ADDRESS>
VITE_STAKING_ADDRESS=<STAKING_CONTRACT_ADDRESS>
VITE_FAUCET_ADDRESS=<FAUCET_ADDRESS>
VITE_BACKEND_URL=http://localhost:4000
VITE_CHAIN_ID=80002
```

- [ ] Frontend .env updated

---

### Step 4: Verify Contracts on PolygonScan

```bash
cd ../hardhat

# Verify Token
npx hardhat verify --network polygonAmoy <AION_TOKEN_ADDRESS>

# Verify Market
npx hardhat verify --network polygonAmoy <MARKET_ADDRESS> <AION_TOKEN_ADDRESS>

# Verify Staking
npx hardhat verify --network polygonAmoy <STAKING_ADDRESS> <AION_TOKEN_ADDRESS>

# Verify Faucet
npx hardhat verify --network polygonAmoy <FAUCET_ADDRESS> <AION_TOKEN_ADDRESS>
```

- [ ] Token verified
- [ ] Market verified
- [ ] Staking verified
- [ ] Faucet verified

**Verification Links:**
- Token: https://amoy.polygonscan.com/address/`<TOKEN_ADDRESS>`
- Market: https://amoy.polygonscan.com/address/`<MARKET_ADDRESS>`
- Staking: https://amoy.polygonscan.com/address/`<STAKING_ADDRESS>`
- Faucet: https://amoy.polygonscan.com/address/`<FAUCET_ADDRESS>`

---

### Step 5: Create Test Markets

```bash
npx hardhat run scripts/seedDemoData.ts --network polygonAmoy
```

**Expected Output:**
```
✅ Market 1 created: BTC/USD
✅ Market 2 created: ETH/USD
✅ Market 3 created: SOL/USD
...
✅ 10 markets created successfully
```

- [ ] Test markets created

---

### Step 6: Start Backend

```bash
cd ../backend
npm run dev
```

**Expected Output:**
```
Backend running on :4000
```

- [ ] Backend running
- [ ] Test health endpoint: `curl http://localhost:4000/health`

---

### Step 7: Start Frontend

```bash
cd ../frontend
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

- [ ] Frontend running
- [ ] Open browser: http://localhost:3000

---

## Post-Deployment Testing

### Test 1: Faucet
- [ ] Connect wallet to app
- [ ] Go to Faucet page
- [ ] Click "Claim 100 AION"
- [ ] Verify transaction on PolygonScan
- [ ] Check AION balance in wallet

### Test 2: Place Bet
- [ ] Go to Battle page
- [ ] Select a market
- [ ] Choose outcome
- [ ] Enter bet amount (min 10 AION)
- [ ] Approve AION token
- [ ] Confirm bet transaction
- [ ] Verify bet on PolygonScan

### Test 3: Market Resolution
- [ ] Wait for market to close (10 minutes)
- [ ] Backend auto-resolves market
- [ ] Check Portfolio for claimable rewards
- [ ] Claim rewards if won

### Test 4: Staking
- [ ] Go to Staking page
- [ ] Enter stake amount (min 100 AION)
- [ ] Approve and stake
- [ ] Verify staking transaction
- [ ] Check staking balance

---

## Production Deployment Checklist

### Security
- [ ] Change owner private key to secure key
- [ ] Use hardware wallet for owner operations
- [ ] Set up multi-sig for owner role
- [ ] Enable 2FA on all accounts
- [ ] Backup all private keys securely

### Monitoring
- [ ] Set up backend monitoring (PM2, DataDog, etc)
- [ ] Set up error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Set up gas price alerts
- [ ] Set up contract event monitoring

### Infrastructure
- [ ] Deploy backend to VPS/cloud
- [ ] Set up SSL certificate
- [ ] Configure domain name
- [ ] Set up CDN for frontend
- [ ] Configure CORS properly
- [ ] Set up database backups

### Documentation
- [ ] Update README with production URLs
- [ ] Document all contract addresses
- [ ] Create user guide
- [ ] Create admin guide
- [ ] Document emergency procedures

---

## Troubleshooting

### Issue: "Insufficient funds for gas"
**Solution**: Get more MATIC from faucet
- https://faucet.polygon.technology/

### Issue: "Contract deployment failed"
**Solution**: Check:
- Private key is correct
- Wallet has enough MATIC
- RPC URL is correct
- Network is Polygon Amoy (80002)

### Issue: "Transaction underpriced"
**Solution**: Increase gas price in hardhat.config.ts:
```typescript
gasPrice: 50000000000, // 50 gwei
```

### Issue: "Nonce too high"
**Solution**: Reset MetaMask account:
- Settings > Advanced > Reset Account

### Issue: "Backend can't connect to contract"
**Solution**: Verify:
- Contract address in .env is correct
- ABI file exists in backend/abi/
- RPC URL is accessible

### Issue: "Frontend shows wrong network"
**Solution**: 
- Check VITE_CHAIN_ID=80002
- Restart frontend dev server
- Clear browser cache

---

## Emergency Procedures

### If Contract Has Bug:
1. Pause all operations (if pause function exists)
2. Document the issue
3. Deploy fixed contract
4. Migrate data if needed
5. Update all configurations

### If Private Key Compromised:
1. Immediately transfer all funds to new wallet
2. Transfer contract ownership to new wallet
3. Update all configurations
4. Investigate breach

### If Backend Down:
1. Check server status
2. Check logs: `pm2 logs`
3. Restart: `pm2 restart all`
4. If persistent, redeploy

---

## Success Criteria

- [ ] All 4 contracts deployed successfully
- [ ] All contracts verified on PolygonScan
- [ ] Backend running and responding
- [ ] Frontend accessible and functional
- [ ] Faucet working (can claim AION)
- [ ] Can place bets successfully
- [ ] Markets auto-resolve correctly
- [ ] Can claim rewards
- [ ] Staking works
- [ ] All transactions visible on PolygonScan

---

## Contact & Support

- **GitHub Issues**: https://github.com/IdcuqS07/Aion-x/issues
- **Polygon Support**: https://support.polygon.technology/
- **Hardhat Docs**: https://hardhat.org/docs

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Network**: Polygon Amoy Testnet (80002)
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

---

## Quick Commands Reference

```bash
# Deploy all contracts
cd hardhat && npx hardhat run scripts/deployAll.ts --network polygonAmoy

# Verify contract
npx hardhat verify --network polygonAmoy <ADDRESS> <CONSTRUCTOR_ARGS>

# Create markets
npx hardhat run scripts/seedDemoData.ts --network polygonAmoy

# Check markets
npx hardhat run scripts/checkMarkets.ts --network polygonAmoy

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Check backend health
curl http://localhost:4000/health
```

---

**Good luck with your deployment! 🚀**

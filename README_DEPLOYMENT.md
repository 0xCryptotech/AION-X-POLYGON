# 🚀 Quick Start - Deploy to Polygon Amoy

## TL;DR - Deploy in 5 Minutes

### 1. Get Test MATIC
```bash
# Visit faucet and get 0.5 MATIC
https://faucet.polygon.technology/
```

### 2. Setup & Deploy
```bash
# Setup environment
cd hardhat
cp .env.example .env
nano .env  # Add your OWNER_PRIVATE_KEY

# Deploy all contracts (one command!)
npx hardhat run scripts/deployAll.ts --network polygonAmoy
```

### 3. Save Addresses
Copy the output addresses and update:

**hardhat/.env:**
```bash
AION_TOKEN_ADDRESS=0x...
CONTRACT_ADDRESS=0x...
STAKING_ADDRESS=0x...
FAUCET_ADDRESS=0x...
```

**backend/.env:**
```bash
CONTRACT_ADDRESS=0x...
```

**frontend/.env:**
```bash
VITE_CONTRACT_ADDRESS=0x...
VITE_TOKEN_ADDRESS=0x...
VITE_STAKING_ADDRESS=0x...
VITE_FAUCET_ADDRESS=0x...
```

### 4. Start App
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Browser
open http://localhost:3000
```

---

## What Gets Deployed

### 4 Smart Contracts:
1. **AIONToken** - ERC-20 token (1B supply)
2. **PredictionMarket** - Core betting logic (2% fee)
3. **AIONStaking** - Revenue sharing for stakers
4. **AIONFaucet** - Free AION for testing (100 per claim)

### Automatic Setup:
- ✅ Contracts integrated automatically
- ✅ Faucet funded with 100,000 AION
- ✅ Ready to use immediately

---

## Cost

**Total**: ~$0.20 (at $1 MATIC)
- Very cheap on Polygon! 🎉

---

## Full Documentation

- **Complete Guide**: [DEPLOY_TO_POLYGON.md](./DEPLOY_TO_POLYGON.md)
- **Contract Details**: [CONTRACTS_GUIDE.md](./CONTRACTS_GUIDE.md)
- **Step-by-Step**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Technical Summary**: [CONTRACT_SUMMARY.md](./CONTRACT_SUMMARY.md)

---

## Troubleshooting

### "Insufficient funds"
Get more MATIC: https://faucet.polygon.technology/

### "Contract deployment failed"
Check:
- Private key in .env is correct
- Wallet has 0.5+ MATIC
- Network is Polygon Amoy (80002)

### "Frontend not connecting"
Verify:
- Contract addresses in frontend/.env
- Backend is running on port 4000
- MetaMask is on Polygon Amoy network

---

## Support

- **GitHub Issues**: https://github.com/IdcuqS07/Aion-x/issues
- **Polygon Docs**: https://docs.polygon.technology/

---

**Network**: Polygon Amoy Testnet
**Chain ID**: 80002
**Explorer**: https://amoy.polygonscan.com/

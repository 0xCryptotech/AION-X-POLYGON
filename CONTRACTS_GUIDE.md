# Smart Contracts Guide - AION-X on Polygon Amoy

## Overview
AION-X menggunakan 4 smart contracts utama yang saling terintegrasi untuk menjalankan prediction market dengan sistem staking dan faucet.

---

## 1. AIONToken.sol ⭐
**Fungsi**: ERC-20 Token untuk platform
**Status**: ✅ Siap Deploy

### Spesifikasi:
- **Name**: AION-X
- **Symbol**: AION
- **Decimals**: 18
- **Total Supply**: 1,000,000,000 AION (1 Billion)
- **Standard**: ERC-20 (transfer, approve, transferFrom)

### Deployment:
```bash
cd hardhat
npx hardhat run scripts/deployToken.ts --network polygonAmoy
```

### Output:
- Contract Address: `0x...` (simpan untuk contract lainnya)

---

## 2. PredictionMarketAION.sol 🎯
**Fungsi**: Core prediction market dengan battle system
**Status**: ✅ Siap Deploy
**Dependencies**: Membutuhkan AIONToken address

### Fitur Utama:
- ✅ 3 Battle Modes: AI vs AI, AI vs Human, Human vs Human
- ✅ Platform Fee: 2% dari total staked
- ✅ Fee Distribution: Otomatis ke staking contract
- ✅ Market Management: Create, bet, close, resolve
- ✅ Claimable System: Winners claim rewards

### Deployment:
```bash
# Edit deployMarketWithFees.ts - ganti AION_TOKEN_ADDRESS
npx hardhat run scripts/deployMarketWithFees.ts --network polygonAmoy
```

### Konfigurasi Setelah Deploy:
```bash
# Set staking contract address (setelah deploy staking)
npx hardhat run scripts/setupStakingIntegration.ts --network polygonAmoy
```

### Functions:
- `createMarket()` - Owner creates new market
- `placeBet()` - Users place bets
- `closeMarket()` - Close market at closeTime
- `resolveMarket()` - Oracle resolves outcome
- `withdrawClaim()` - Winners claim rewards

---

## 3. AIONFaucet.sol 💧
**Fungsi**: Faucet untuk distribusi AION gratis
**Status**: ✅ Siap Deploy
**Dependencies**: Membutuhkan AIONToken address

### Spesifikasi:
- **Claim Amount**: 100 AION per claim
- **Cooldown**: 24 hours
- **Access**: Public (anyone can claim)

### Deployment:
```bash
# Edit deployFaucet.ts - ganti aionTokenAddress
npx hardhat run scripts/deployFaucet.ts --network polygonAmoy
```

### Setup Setelah Deploy:
```bash
# Transfer AION ke faucet (misal 100,000 AION)
# Gunakan script atau manual transfer
```

### Functions:
- `claim()` - Users claim 100 AION
- `setClaimAmount()` - Owner adjust amount
- `setCooldown()` - Owner adjust cooldown
- `withdraw()` - Owner withdraw funds

---

## 4. AIONStaking.sol 🔒
**Fungsi**: Staking contract dengan revenue sharing
**Status**: ✅ Siap Deploy
**Dependencies**: Membutuhkan AIONToken address

### Model Staking:
- **Revenue Sharing**: Stakers earn 2% platform fees
- **Variable APY**: Depends on platform volume
- **Min Stake**: 100 AION
- **Lock Period**: 7 days
- **Reward Distribution**: Proportional to shares

### Deployment:
```bash
# Edit deployStaking.ts - ganti AION_TOKEN_ADDRESS
npx hardhat run scripts/deployStaking.ts --network polygonAmoy
```

### Konfigurasi Setelah Deploy:
```bash
# Set prediction market address
# Ini memungkinkan market contract deposit fees ke staking
```

### Functions:
- `stake()` - Users stake AION
- `unstake()` - Users unstake after lock period
- `depositRevenue()` - Market deposits fees (auto)
- `calculateUserValue()` - View current value
- `getCurrentAPY()` - View current APY

---

## Deployment Order (PENTING!)

### Step 1: Deploy AIONToken
```bash
npx hardhat run scripts/deployToken.ts --network polygonAmoy
```
**Output**: `AION_TOKEN_ADDRESS = 0x...`

### Step 2: Deploy PredictionMarket
```bash
# Edit deployMarketWithFees.ts dengan AION_TOKEN_ADDRESS
npx hardhat run scripts/deployMarketWithFees.ts --network polygonAmoy
```
**Output**: `MARKET_ADDRESS = 0x...`

### Step 3: Deploy Staking
```bash
# Edit deployStaking.ts dengan AION_TOKEN_ADDRESS
npx hardhat run scripts/deployStaking.ts --network polygonAmoy
```
**Output**: `STAKING_ADDRESS = 0x...`

### Step 4: Deploy Faucet
```bash
# Edit deployFaucet.ts dengan AION_TOKEN_ADDRESS
npx hardhat run scripts/deployFaucet.ts --network polygonAmoy
```
**Output**: `FAUCET_ADDRESS = 0x...`

### Step 5: Setup Integration
```bash
# Edit setupStakingIntegration.ts dengan addresses
npx hardhat run scripts/setupStakingIntegration.ts --network polygonAmoy
```

### Step 6: Fund Contracts
```bash
# Transfer AION ke Faucet (100,000 AION)
# Transfer AION ke Market untuk initial liquidity (optional)
```

---

## Environment Variables Update

Setelah deployment, update file-file berikut:

### 1. Backend (.env)
```bash
PROVIDER_URL=https://rpc-amoy.polygon.technology/
OWNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
CONTRACT_ADDRESS=<MARKET_ADDRESS>
```

### 2. Frontend (.env)
```bash
VITE_CONTRACT_ADDRESS=<MARKET_ADDRESS>
VITE_TOKEN_ADDRESS=<AION_TOKEN_ADDRESS>
VITE_STAKING_ADDRESS=<STAKING_ADDRESS>
VITE_FAUCET_ADDRESS=<FAUCET_ADDRESS>
VITE_BACKEND_URL=http://localhost:4000
VITE_CHAIN_ID=80002
```

### 3. Backend ABI
```bash
# Copy ABI dari artifacts ke backend/abi/
cp artifacts/contracts/PredictionMarketAION.sol/PredictionMarketAION.json backend/abi/
```

---

## Contract Interactions

### User Flow:
1. **Get AION**: Claim dari faucet (100 AION)
2. **Approve**: Approve market contract untuk spend AION
3. **Place Bet**: Bet pada market dengan AION
4. **Wait**: Market closes dan resolves
5. **Claim**: Winners claim rewards
6. **Stake** (Optional): Stake AION untuk earn platform fees

### Platform Flow:
1. **Create Markets**: Owner creates markets via backend
2. **Auto-Resolve**: Backend auto-resolves markets
3. **Fee Distribution**: 2% fees auto-sent to staking
4. **Revenue Sharing**: Stakers earn proportional rewards

---

## Gas Estimates (Polygon Amoy)

| Action | Gas Estimate | Cost (MATIC @ $1) |
|--------|--------------|-------------------|
| Deploy Token | ~1,000,000 | ~$0.001 |
| Deploy Market | ~2,500,000 | ~$0.0025 |
| Deploy Staking | ~2,000,000 | ~$0.002 |
| Deploy Faucet | ~800,000 | ~$0.0008 |
| Create Market | ~200,000 | ~$0.0002 |
| Place Bet | ~100,000 | ~$0.0001 |
| Resolve Market | ~150,000 | ~$0.00015 |
| Claim Rewards | ~80,000 | ~$0.00008 |
| Stake AION | ~120,000 | ~$0.00012 |
| Unstake AION | ~100,000 | ~$0.0001 |

**Total Deployment Cost**: ~$0.006 (sangat murah di Polygon!)

---

## Verification on PolygonScan

Setelah deployment, verify contracts:

```bash
npx hardhat verify --network polygonAmoy <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### Example:
```bash
# Verify Token
npx hardhat verify --network polygonAmoy 0xTOKEN_ADDRESS

# Verify Market
npx hardhat verify --network polygonAmoy 0xMARKET_ADDRESS 0xTOKEN_ADDRESS

# Verify Staking
npx hardhat verify --network polygonAmoy 0xSTAKING_ADDRESS 0xTOKEN_ADDRESS

# Verify Faucet
npx hardhat verify --network polygonAmoy 0xFAUCET_ADDRESS 0xTOKEN_ADDRESS
```

---

## Security Considerations

### ✅ Implemented:
- Owner-only functions for critical operations
- Oracle-only resolution
- Reentrancy protection via state updates before transfers
- Input validation on all functions
- Time-based market closure
- Cooldown on faucet claims
- Lock period on staking

### ⚠️ Before Mainnet:
- [ ] Professional audit required
- [ ] Add emergency pause mechanism
- [ ] Implement timelock for owner functions
- [ ] Add multi-sig for owner role
- [ ] Comprehensive testing suite
- [ ] Bug bounty program

---

## Testing Checklist

### Token:
- [ ] Deploy successful
- [ ] Transfer works
- [ ] Approve/transferFrom works
- [ ] Balance tracking correct

### Market:
- [ ] Create market works
- [ ] Place bet works
- [ ] Close market works
- [ ] Resolve market works
- [ ] Claim rewards works
- [ ] Fee distribution to staking works

### Faucet:
- [ ] Claim works
- [ ] Cooldown enforced
- [ ] Balance sufficient

### Staking:
- [ ] Stake works
- [ ] Unstake after lock period works
- [ ] Revenue deposit works
- [ ] APY calculation correct
- [ ] Share calculation correct

---

## Support & Resources

- **Polygon Amoy Faucet**: https://faucet.polygon.technology/
- **Polygon Amoy Explorer**: https://amoy.polygonscan.com/
- **Polygon Docs**: https://docs.polygon.technology/
- **Hardhat Docs**: https://hardhat.org/docs

---

## Quick Reference

```bash
# Deploy all contracts
./deploy-all.sh

# Check deployment
npx hardhat run scripts/checkMarkets.ts --network polygonAmoy

# Create test markets
npx hardhat run scripts/seedDemoData.ts --network polygonAmoy

# Monitor markets
npx hardhat run scripts/checkOpenMarkets.ts --network polygonAmoy
```

---

**Status**: ✅ All contracts ready for Polygon Amoy deployment
**Last Updated**: November 24, 2025

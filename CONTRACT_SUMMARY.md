# 📊 AION-X Smart Contracts Summary

## Contract Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AION-X Platform                       │
│                     Polygon Amoy Testnet                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│  AIONToken   │◄───│ PredictionMarket │───►│ AIONStaking  │
│   (ERC-20)   │    │   (Core Logic)   │    │ (Rev Share)  │
└──────────────┘    └──────────────────┘    └──────────────┘
        ▲                     │
        │                     │
        │                     ▼
┌──────────────┐    ┌──────────────────┐
│ AIONFaucet   │    │   Users/Bettors  │
│ (Testnet)    │    │                  │
└──────────────┘    └──────────────────┘
```

---

## 1. 🪙 AIONToken.sol

### Purpose
ERC-20 token yang digunakan sebagai currency utama di platform

### Key Features
- ✅ Standard ERC-20 implementation
- ✅ Fixed supply: 1 Billion AION
- ✅ 18 decimals
- ✅ No minting/burning (immutable supply)

### Functions
| Function | Access | Description |
|----------|--------|-------------|
| `transfer()` | Public | Transfer AION to address |
| `approve()` | Public | Approve spender |
| `transferFrom()` | Public | Transfer from approved address |

### State Variables
```solidity
name = "AION-X"
symbol = "AION"
decimals = 18
totalSupply = 1,000,000,000 * 10^18
```

### Dependencies
- None (standalone)

---

## 2. 🎯 PredictionMarketAION.sol

### Purpose
Core contract untuk prediction market dengan 3 battle modes

### Key Features
- ✅ 3 Battle Modes: AI vs AI, AI vs Human, Human vs Human
- ✅ Platform Fee: 2% (200 basis points)
- ✅ Automatic fee distribution to staking
- ✅ Oracle-based resolution
- ✅ Claimable rewards system

### Battle Modes
```solidity
enum Mode {
    AI_VS_AI,      // 0: Bet on AI predictions
    AI_VS_HUMAN,   // 1: Compete against AI
    HUMAN_VS_HUMAN // 2: Challenge other players
}
```

### Market Status
```solidity
enum Status {
    OPEN,     // Accepting bets
    CLOSED,   // No more bets, waiting resolution
    RESOLVED  // Winner determined
}
```

### Core Functions
| Function | Access | Description |
|----------|--------|-------------|
| `createMarket()` | Owner | Create new prediction market |
| `placeBet()` | Public | Place bet on outcome |
| `closeMarket()` | Owner/Auto | Close market at closeTime |
| `resolveMarket()` | Oracle | Resolve with winning outcome |
| `withdrawClaim()` | Public | Claim winnings |

### Fee Distribution
```
Total Staked: 100 AION
├─ Platform Fee (2%): 2 AION → Staking Contract
└─ Prize Pool (98%): 98 AION → Winners
```

### Dependencies
- Requires: AIONToken address
- Integrates: AIONStaking address (for fees)

---

## 3. 🔒 AIONStaking.sol

### Purpose
Staking contract dengan revenue sharing dari platform fees

### Key Features
- ✅ Revenue Sharing: Stakers earn 2% of all battle fees
- ✅ Variable APY: Depends on platform volume
- ✅ Share-based system: Fair distribution
- ✅ Lock period: 7 days minimum
- ✅ Proportional rewards

### Staking Model
```
User Stakes 1000 AION
├─ Receives: Shares proportional to pool
├─ Lock Period: 7 days
├─ Earns: Share of platform fees (2% of battles)
└─ Unstake: Original stake + accumulated rewards
```

### APY Calculation
```
APY = (Annual Revenue / Total Staked) * 100

Example:
- Total Staked: 100,000 AION
- Daily Battles: 1,000
- Avg Bet: 100 AION
- Daily Volume: 100,000 AION
- Daily Fees (2%): 2,000 AION
- Annual Fees: 730,000 AION
- APY: 730%
```

### Core Functions
| Function | Access | Description |
|----------|--------|-------------|
| `stake()` | Public | Stake AION, get shares |
| `unstake()` | Public | Unstake after lock period |
| `depositRevenue()` | Market | Auto-deposit fees |
| `calculateUserValue()` | View | Current stake value |
| `getCurrentAPY()` | View | Current APY estimate |

### Constants
```solidity
MIN_STAKE = 100 * 10^18      // 100 AION minimum
LOCK_PERIOD = 7 days          // 7 day lock
```

### Dependencies
- Requires: AIONToken address
- Receives from: PredictionMarket (fees)

---

## 4. 💧 AIONFaucet.sol

### Purpose
Testnet faucet untuk distribusi AION gratis ke users

### Key Features
- ✅ Free AION for testing
- ✅ 24-hour cooldown
- ✅ Configurable claim amount
- ✅ Owner-controlled

### Claim Rules
```
Claim Amount: 100 AION
Cooldown: 24 hours
Max per user: Unlimited (after cooldown)
```

### Core Functions
| Function | Access | Description |
|----------|--------|-------------|
| `claim()` | Public | Claim 100 AION |
| `setClaimAmount()` | Owner | Adjust claim amount |
| `setCooldown()` | Owner | Adjust cooldown period |
| `withdraw()` | Owner | Withdraw funds |

### Dependencies
- Requires: AIONToken address
- Needs: AION balance for distribution

---

## Contract Interactions Flow

### User Journey: Place Bet
```
1. User → Faucet.claim()
   └─ Receives: 100 AION

2. User → Token.approve(Market, amount)
   └─ Approves: Market to spend AION

3. User → Market.placeBet(marketId, outcome, amount)
   ├─ Token.transferFrom(User, Market, amount)
   ├─ Records bet
   └─ Updates pools

4. Time passes → Market closes

5. Oracle → Market.resolveMarket(marketId, winningOutcome)
   ├─ Calculates winners
   ├─ Deducts 2% fee
   ├─ Token.transfer(Staking, fee)
   └─ Updates claimable amounts

6. Winner → Market.withdrawClaim()
   └─ Token.transfer(Winner, claimable)
```

### Platform Revenue Flow
```
Battle Completed (100 AION total)
│
├─ Platform Fee (2 AION)
│  └─ Market.resolveMarket()
│     └─ Token.transfer(Staking, 2 AION)
│        └─ Staking.depositRevenue()
│           └─ Distributed to stakers proportionally
│
└─ Prize Pool (98 AION)
   └─ Distributed to winners
      └─ Market.withdrawClaim()
         └─ Token.transfer(Winner, share)
```

---

## Gas Costs (Polygon Amoy)

| Operation | Gas Used | Cost @ 30 gwei | Cost @ $1 MATIC |
|-----------|----------|----------------|-----------------|
| Deploy Token | ~1,000,000 | 0.03 MATIC | $0.03 |
| Deploy Market | ~2,500,000 | 0.075 MATIC | $0.075 |
| Deploy Staking | ~2,000,000 | 0.06 MATIC | $0.06 |
| Deploy Faucet | ~800,000 | 0.024 MATIC | $0.024 |
| **Total Deploy** | **~6,300,000** | **0.189 MATIC** | **$0.189** |
| | | | |
| Create Market | ~200,000 | 0.006 MATIC | $0.006 |
| Place Bet | ~100,000 | 0.003 MATIC | $0.003 |
| Resolve Market | ~150,000 | 0.0045 MATIC | $0.0045 |
| Claim Rewards | ~80,000 | 0.0024 MATIC | $0.0024 |
| Stake AION | ~120,000 | 0.0036 MATIC | $0.0036 |
| Unstake AION | ~100,000 | 0.003 MATIC | $0.003 |
| Claim Faucet | ~60,000 | 0.0018 MATIC | $0.0018 |

**Total Deployment Cost: ~$0.19** (Very cheap on Polygon!)

---

## Security Features

### Access Control
- ✅ Owner-only functions for critical operations
- ✅ Oracle-only resolution
- ✅ Time-based market closure
- ✅ Cooldown on faucet claims
- ✅ Lock period on staking

### Safety Mechanisms
- ✅ Input validation on all functions
- ✅ Reentrancy protection (state before transfer)
- ✅ Balance checks before transfers
- ✅ Overflow protection (Solidity 0.8+)
- ✅ Event emission for all state changes

### Audit Status
⚠️ **NOT AUDITED** - For testnet use only
- Do NOT use on mainnet without professional audit
- Recommended: Trail of Bits, OpenZeppelin, ConsenSys Diligence

---

## Deployment Summary

### Required Steps
1. ✅ Deploy AIONToken
2. ✅ Deploy PredictionMarket (with token address)
3. ✅ Deploy AIONStaking (with token address)
4. ✅ Deploy AIONFaucet (with token address)
5. ✅ Set staking address in market
6. ✅ Set market address in staking
7. ✅ Fund faucet with AION

### Configuration Files to Update
- `backend/.env` → CONTRACT_ADDRESS
- `frontend/.env` → All contract addresses
- `backend/abi/` → Copy PredictionMarket ABI

### Verification
- Verify all contracts on PolygonScan
- Test all core functions
- Monitor gas costs
- Check event emissions

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Total Contracts | 4 |
| Total Lines of Code | ~500 |
| Solidity Version | 0.8.19 |
| Network | Polygon Amoy (80002) |
| Deployment Cost | ~$0.19 |
| Token Supply | 1,000,000,000 AION |
| Platform Fee | 2% |
| Min Stake | 100 AION |
| Lock Period | 7 days |
| Faucet Amount | 100 AION |
| Faucet Cooldown | 24 hours |

---

## Contract Addresses (After Deployment)

| Contract | Address | Explorer |
|----------|---------|----------|
| AIONToken | `0x...` | [View](https://amoy.polygonscan.com/address/0x...) |
| PredictionMarket | `0x...` | [View](https://amoy.polygonscan.com/address/0x...) |
| AIONStaking | `0x...` | [View](https://amoy.polygonscan.com/address/0x...) |
| AIONFaucet | `0x...` | [View](https://amoy.polygonscan.com/address/0x...) |

---

## Resources

- **Contracts**: `/hardhat/contracts/`
- **Deployment**: `/hardhat/scripts/deployAll.ts`
- **Full Guide**: `/CONTRACTS_GUIDE.md`
- **Checklist**: `/DEPLOYMENT_CHECKLIST.md`
- **Polygon Docs**: https://docs.polygon.technology/
- **Hardhat Docs**: https://hardhat.org/docs

---

**Status**: ✅ Ready for Deployment
**Last Updated**: November 24, 2025
**Network**: Polygon Amoy Testnet (Chain ID: 80002)

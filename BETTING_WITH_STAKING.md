# Betting + Staking Integration

## How It Works Now

### Battle Flow with Fees:

```
1. Users bet on battle → Total pool: 1000 AION
2. Battle resolves → Platform takes 2% fee: 20 AION
3. Fee goes to staking pool → Distributed to stakers
4. Winners split remaining 98%: 980 AION
```

### Example:

**Battle**:
- User A bets 500 AION (Bullish)
- User B bets 500 AION (Bearish)
- Total pool: 1000 AION

**Resolution** (Bullish wins):
- Platform fee (2%): 20 AION → Staking pool
- Remaining: 980 AION
- User A wins: 980 AION
- User A profit: 480 AION (not 500)

**Stakers**:
- 20 AION added to revenue pool
- Distributed proportionally to all stakers
- If you have 10% of staking pool → You get 2 AION

## Changes Made

### 1. Prediction Market Contract
- ✅ Added `PLATFORM_FEE_BPS = 200` (2%)
- ✅ Added `stakingContract` address
- ✅ Fee deducted on resolution
- ✅ Fee sent to staking contract
- ✅ Winners get 98% of pool

### 2. Staking Contract
- ✅ Added `depositRevenue()` function
- ✅ Accepts fees from prediction market
- ✅ Distributes to stakers proportionally

### 3. Integration
- ✅ Contracts linked via addresses
- ✅ Automatic fee transfer
- ✅ No manual intervention needed

## User Impact

### For Bettors:
- **Before**: Win 100% of losing side's bets
- **After**: Win 98% of losing side's bets
- **Fee**: 2% goes to stakers
- **Still profitable**: 98% return is good

### For Stakers:
- **Earn**: 2% of all battle volume
- **Passive**: No action needed
- **Variable**: More battles = more revenue

## Economics

### Example Daily Volume:

**Scenario**: 5,000 AION daily battle volume
- Platform fee (2%): 100 AION/day
- Annual: 36,500 AION
- If 10,000 AION staked: 365% APY

**Scenario**: 20,000 AION daily volume
- Platform fee (2%): 400 AION/day
- Annual: 146,000 AION
- If 10,000 AION staked: 1,460% APY

**All variable and market-driven** ✅

## Deployment Steps

### Option A: Redeploy Prediction Market (Clean)
```bash
# 1. Deploy new prediction market with fee mechanism
npx hardhat run scripts/deployMarketWithFees.ts --network bscTestnet

# 2. Setup integration
npx hardhat run scripts/setupStakingIntegration.ts --network bscTestnet

# 3. Update frontend with new market address
# 4. Migrate users to new contract
```

### Option B: Upgrade Existing (Complex)
- Requires proxy pattern
- Not implemented
- Not recommended

**Recommendation**: Option A (Redeploy)

## Frontend Changes

### Battle Result Display:
```
Before:
"You won 500 AION!"

After:
"You won 490 AION!
(2% platform fee: 10 AION → Stakers)"
```

### Fee Disclosure:
```
"Platform Fee: 2%
This fee is distributed to AION stakers as revenue sharing.
Winners receive 98% of the total pool."
```

## User Communication

### Announcement:
```
🎉 New Feature: Revenue Sharing!

We're introducing a 2% platform fee on all battles.
This fee goes directly to AION stakers.

For Bettors:
- You still win 98% of the pool
- Minimal impact on profits
- Helps sustain the platform

For Stakers:
- Earn 2% of all battle volume
- Passive income from platform activity
- Variable APY based on volume

Win-win for everyone! 🚀
```

## Migration Plan

### Phase 1: Deploy (Day 1)
- Deploy new prediction market
- Deploy staking contract
- Setup integration
- Test thoroughly

### Phase 2: Announce (Day 2-3)
- Announce fee structure
- Explain benefits
- Show APY projections
- Answer questions

### Phase 3: Migrate (Day 4-7)
- Let users finish existing battles
- Redirect to new contract
- Update frontend
- Monitor closely

### Phase 4: Deprecate (Day 8+)
- Close old contract
- Full migration complete

## Testing Checklist

- [ ] Deploy new prediction market
- [ ] Deploy staking contract
- [ ] Setup integration
- [ ] Test battle with fee deduction
- [ ] Verify fee goes to staking
- [ ] Test staker receives revenue
- [ ] Check winner gets 98%
- [ ] Verify APY calculation
- [ ] Test with multiple battles
- [ ] Monitor gas costs

## FAQ

**Q: Why 2% fee?**
A: Industry standard. Polymarket charges 2%, Augur charges 1-2%.

**Q: Can I avoid the fee?**
A: No, it's automatic. But you can stake to earn it back!

**Q: What if I'm both bettor and staker?**
A: You pay 2% on bets, earn share of all fees. Net positive if you stake enough.

**Q: Will fee increase?**
A: No plans. 2% is sustainable and fair.

**Q: Where does fee go exactly?**
A: Directly to staking contract, distributed to all stakers proportionally.

## Next Steps

1. **Review this plan** - Make sure you agree
2. **Deploy new contracts** - With fee mechanism
3. **Test thoroughly** - Multiple scenarios
4. **Announce to users** - Clear communication
5. **Monitor closely** - First week critical

**Ready to deploy?**

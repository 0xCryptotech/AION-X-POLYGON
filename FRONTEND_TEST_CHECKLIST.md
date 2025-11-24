# Frontend Test Checklist

## ✅ Status: Ready to Test

### Contract Addresses (Updated)
- **Prediction Market**: `Deploy to Polygon Amoy first`
- **Staking**: `Deploy to Polygon Amoy first`
- **AION Token**: `Deploy to Polygon Amoy first`
- **Faucet**: `Deploy to Polygon Amoy first`

**Deployment Command:**
```bash
cd hardhat
npx hardhat run scripts/deployAll.ts --network polygonAmoy
```

### Build Status
- ✅ `npm run build` successful
- ✅ ABI files present
- ✅ Contract addresses updated
- ✅ No compilation errors

## Test Scenarios

### 1. Homepage
- [ ] Visit https://aion-x.vercel.app/
- [ ] Check 10 markets display
- [ ] Verify pool sizes show
- [ ] Click market card opens modal

### 2. Battle Page
- [ ] Visit /battle
- [ ] See 3 battle modes (AI vs AI, AI vs Human, Human vs Human)
- [ ] Click "Enter the Arena"
- [ ] Battle modal opens

### 3. AI vs AI Battle
- [ ] Select BTC/USD asset
- [ ] See AI predictions (GPT-5, Claude-3)
- [ ] Select AI Model 1
- [ ] Enter stake: 10 AION
- [ ] Click "Start Battle"
- [ ] MetaMask approve AION
- [ ] MetaMask confirm bet
- [ ] Battle countdown starts (10 min)
- [ ] Price updates real-time
- [ ] Wait for resolution
- [ ] Result modal shows win/loss
- [ ] Check 2% fee mentioned

### 4. Portfolio Page
- [ ] Visit /portfolio
- [ ] Connect wallet
- [ ] See AION balance
- [ ] See claimable rewards
- [ ] See battle history
- [ ] Battle cards show status
- [ ] Win/loss indicators correct
- [ ] Click withdraw (if claimable > 0)

### 5. Staking Page
- [ ] Visit /staking
- [ ] See "Stakers receive a share of protocol revenue"
- [ ] See "Estimated APY depends on volume & fees"
- [ ] See risk disclosure
- [ ] See total staked
- [ ] See 24h revenue
- [ ] See estimated APY (variable)
- [ ] Enter stake amount
- [ ] See pool share calculation
- [ ] Click "Stake" button
- [ ] MetaMask approve
- [ ] MetaMask confirm stake
- [ ] See stake in "Your Stakes"

### 6. Faucet Page
- [ ] Visit /faucet
- [ ] Connect wallet
- [ ] Click "Get 100 AION"
- [ ] MetaMask confirm
- [ ] Balance increases

### 7. Leaderboard
- [ ] Visit /leaderboard
- [ ] See top 10 traders
- [ ] Win rates display
- [ ] Total earnings show

## Expected Behavior

### Battle with 2% Fee
**Example**: 1000 AION battle
- Platform fee: 20 AION (2%)
- Winner receives: 980 AION (98%)
- Fee goes to staking pool

**Result Modal Should Show**:
```
You won 490 AION!
(Platform fee: 10 AION → Stakers)
```

### Staking Returns
**Variable APY Display**:
```
Estimated APY: ~365%
Based on last 7 days activity
Variable, not guaranteed
```

**Risk Disclosure**:
```
Returns are variable and depend on platform activity.
Estimated APY is not guaranteed and may increase or decrease.
Smart contract risk exists.
```

## Known Issues to Check

### Potential Issues:
1. **Old battles**: Markets from old contract won't show (expected)
2. **Battle history**: Only shows battles from new contract
3. **Claimable**: Old contract claims need manual withdrawal

### If Issues Found:
1. Check browser console for errors
2. Verify MetaMask on BSC Testnet
3. Check contract addresses match
4. Clear browser cache
5. Try incognito mode

## Success Criteria

### Must Work:
- ✅ Connect wallet
- ✅ Get AION from faucet
- ✅ Start battle (any mode)
- ✅ Battle resolves correctly
- ✅ Winner gets 98% of pool
- ✅ Withdraw rewards
- ✅ Stake AION
- ✅ See staking stats

### Should Display:
- ✅ "2% platform fee" messaging
- ✅ "Variable APY" (not fixed)
- ✅ Risk disclosures
- ✅ Real-time price updates
- ✅ Battle countdown timer

## Test Results

### Date: _________
### Tester: _________

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage | ⬜ Pass / ⬜ Fail | |
| Battle (AI vs AI) | ⬜ Pass / ⬜ Fail | |
| Battle Resolution | ⬜ Pass / ⬜ Fail | |
| Portfolio | ⬜ Pass / ⬜ Fail | |
| Staking | ⬜ Pass / ⬜ Fail | |
| Faucet | ⬜ Pass / ⬜ Fail | |
| Withdraw | ⬜ Pass / ⬜ Fail | |

### Overall: ⬜ PASS / ⬜ FAIL

---

**Start testing now at**: https://aion-x.vercel.app/

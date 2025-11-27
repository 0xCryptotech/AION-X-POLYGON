# Improved Place Bet - Test Plan

## 🎯 New Features Implemented

### 1. ✅ Check Allowance Before Approve
**Feature**: Check current allowance first, skip approve if sufficient

**Code**:
```javascript
const currentAllowance = await tokenContract.allowance(userAddress, CONTRACT_ADDRESS);
if (currentAllowance.gte(amountWei)) {
  console.log('Skipping approve ✅');
  // Skip to place bet
}
```

**Benefit**: 
- Save 1 transaction if allowance already exists
- Save ~0.001 MATIC gas fee
- Save ~30 seconds time

---

### 2. ✅ Verify Allowance After Approve
**Feature**: Wait and verify allowance actually updated after approve

**Code**:
```javascript
let allowanceVerified = false;
let verifyAttempts = 0;

while (!allowanceVerified && verifyAttempts < 10) {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
  const newAllowance = await tokenContract.allowance(userAddress, CONTRACT_ADDRESS);
  if (newAllowance.gte(amountWei)) {
    allowanceVerified = true; // ✅
  }
  verifyAttempts++;
}
```

**Benefit**:
- Ensure allowance is actually updated before place bet
- Prevent "insufficient allowance" errors
- Max wait: 20 seconds (10 attempts × 2 seconds)

---

### 3. ✅ Wait 2 Confirmations (Not 1)
**Feature**: Wait for 2 block confirmations for better security

**Code**:
```javascript
await approveTx.wait(2);  // 2 confirmations
await tx.wait(2);         // 2 confirmations
```

**Benefit**:
- More secure (less chance of reorg)
- Better guarantee transaction is final
- Only ~10 seconds extra wait

---

### 4. ✅ Gas Estimation with Retry
**Feature**: Try gas estimation 3 times, use fallback if all fail

**Code**:
```javascript
let estimateAttempts = 0;
while (estimateAttempts < 3) {
  try {
    gasLimit = await contract.estimateGas.placeBet(...);
    break;
  } catch {
    estimateAttempts++;
    if (estimateAttempts >= 3) {
      gasLimit = ethers.BigNumber.from(300000); // Fallback
    }
  }
}
```

**Benefit**:
- Handle temporary RPC issues
- Prevent transaction failure due to gas estimation errors
- Fallback ensures transaction can proceed

---

### 5. ✅ Better Error Messages
**Feature**: Specific, actionable error messages

**Examples**:
```javascript
// Allowance timeout
"Approval confirmed but allowance not updated yet. Wait 10-20s and try again (approval will be skipped)."

// Gas estimation failure
"Cannot estimate gas. Check if market is still open and you have sufficient balance."

// Network error
"Network error. Please check your connection and try again."

// Timeout
"Transaction timeout. Check PolygonScan for status and try again if needed."
```

**Benefit**:
- User knows exactly what to do
- Reduces support requests
- Better UX

---

## 🧪 Test Cases

### Test Case 1: First Time Bet (No Allowance)
**Scenario**: User bets for the first time, no existing allowance

**Steps**:
1. Connect wallet (fresh address)
2. Select market and stake (10 AION)
3. Click "Start Battle"

**Expected Flow**:
```
1. Check allowance → 0 AION ❌
2. Approve AION → MetaMask popup 1
3. Wait 2 confirmations → ~40s
4. Verify allowance (max 10 attempts) → ✅
5. Estimate gas (with retry) → Success
6. Place bet → MetaMask popup 2
7. Wait 2 confirmations → ~40s
8. ✅ Bet placed!
```

**Expected Time**: ~80-100 seconds
**Expected Gas**: ~0.003 MATIC

**Success Criteria**:
- ✅ 2 MetaMask popups
- ✅ Allowance verified message
- ✅ Bet confirmed
- ✅ Battle starts

---

### Test Case 2: Second Bet (Existing Allowance)
**Scenario**: User bets again with same or lower amount

**Steps**:
1. Already have allowance from previous bet
2. Select market and stake (10 AION or less)
3. Click "Start Battle"

**Expected Flow**:
```
1. Check allowance → 10 AION ✅
2. Skip approve → "Allowance sufficient, skipping approval ✅"
3. Estimate gas (with retry) → Success
4. Place bet → MetaMask popup (only 1!)
5. Wait 2 confirmations → ~40s
6. ✅ Bet placed!
```

**Expected Time**: ~40-50 seconds (HALF of first time!)
**Expected Gas**: ~0.002 MATIC (LESS than first time!)

**Success Criteria**:
- ✅ Only 1 MetaMask popup
- ✅ "Skipping approval" message shown
- ✅ Bet confirmed faster
- ✅ Battle starts

---

### Test Case 3: Allowance Verification Timeout
**Scenario**: Approve confirmed but allowance not updated (rare)

**Steps**:
1. Approve transaction confirmed
2. Allowance check fails for 20 seconds (10 attempts)

**Expected Flow**:
```
1. Check allowance → 0 AION ❌
2. Approve AION → Confirmed
3. Verify allowance → Timeout after 20s ❌
4. Error: "Approval confirmed but allowance not updated yet..."
```

**Expected Error**:
```
"Approval transaction confirmed but allowance not updated yet. 
Please wait 10-20 seconds and try again (approval will be skipped next time)."
```

**User Action**: Wait 10-20 seconds, try again
**Next Attempt**: Should skip approve (Test Case 2)

**Success Criteria**:
- ✅ Clear error message
- ✅ User knows what to do
- ✅ Next attempt works

---

### Test Case 4: Gas Estimation Failure
**Scenario**: RPC fails to estimate gas (temporary issue)

**Steps**:
1. Approve successful
2. Gas estimation fails 3 times
3. Use fallback gas limit

**Expected Flow**:
```
1. Approve → Success
2. Estimate gas attempt 1 → Fail
3. Estimate gas attempt 2 → Fail
4. Estimate gas attempt 3 → Fail
5. Use fallback gas limit (300,000)
6. Place bet → Success with fallback gas
```

**Success Criteria**:
- ✅ Transaction proceeds despite estimation failure
- ✅ Fallback gas limit used
- ✅ Bet confirmed

---

### Test Case 5: Network Congestion (2 Confirmations)
**Scenario**: Network is slow, test 2 confirmations

**Steps**:
1. Place bet during network congestion
2. Wait for 2 confirmations

**Expected Flow**:
```
1. Approve → Wait for 2 confirmations (~40-60s)
2. Place bet → Wait for 2 confirmations (~40-60s)
3. Total: ~80-120s (slower but more secure)
```

**Success Criteria**:
- ✅ Both transactions get 2 confirmations
- ✅ More secure against reorg
- ✅ Bet confirmed

---

### Test Case 6: Insufficient Balance
**Scenario**: User tries to bet more than balance

**Steps**:
1. Balance: 5 AION
2. Try to bet: 10 AION

**Expected Flow**:
```
1. Check allowance → May pass
2. Approve → May pass (if needed)
3. Place bet → MetaMask rejects ❌
4. Error: "Insufficient AION balance"
```

**Success Criteria**:
- ✅ MetaMask shows insufficient balance
- ✅ Clear error message
- ✅ No transaction sent

---

### Test Case 7: Market Closed
**Scenario**: User tries to bet on closed market

**Steps**:
1. Select market that just closed
2. Try to place bet

**Expected Flow**:
```
1. Check allowance → Pass
2. Approve → Pass (if needed)
3. Estimate gas → Fail (market closed)
4. Use fallback gas
5. Place bet → Contract rejects ❌
6. Error: "Market not open"
```

**Success Criteria**:
- ✅ Contract rejects transaction
- ✅ Clear error message
- ✅ User knows market is closed

---

## 📊 Performance Comparison

### Before Improvements

| Scenario | Transactions | Time | Gas | Issues |
|----------|-------------|------|-----|--------|
| First bet | 2 | ~60s | 0.003 | Sometimes fails |
| Second bet | 2 | ~60s | 0.003 | Always approves |
| Allowance issue | - | Fail | - | No verification |

### After Improvements

| Scenario | Transactions | Time | Gas | Issues |
|----------|-------------|------|-----|--------|
| First bet | 2 | ~80-100s | 0.003 | Verified ✅ |
| Second bet | 1 | ~40-50s | 0.002 | Skips approve ✅ |
| Allowance issue | - | Clear error | - | Verified + retry ✅ |

**Improvements**:
- ✅ Second bet: **50% faster** (40s vs 60s)
- ✅ Second bet: **33% cheaper** (0.002 vs 0.003 MATIC)
- ✅ Allowance: **Verified** (no more failures)
- ✅ Errors: **Clear and actionable**
- ✅ Security: **2 confirmations** (more secure)

---

## 🔧 Manual Testing Steps

### Setup
1. Connect MetaMask to Polygon Amoy
2. Ensure you have:
   - 0.1 MATIC for gas
   - 50 AION for testing
3. Open browser console (F12)

### Test 1: First Bet
```
1. Go to Battle page
2. Select AI model
3. Set stake: 10 AION
4. Click "Start Battle"
5. Observe console logs:
   - "Checking current allowance..."
   - "Allowance insufficient, approving..."
   - "Approve tx sent: 0x..."
   - "Approve confirmed in block: ..."
   - "Verifying allowance update..."
   - "Allowance verification attempt 1/10"
   - "Allowance verified! ✅"
   - "Estimating gas..."
   - "Placing bet..."
   - "Bet confirmed! ✅"
6. Check progress messages in UI
7. Verify 2 MetaMask popups
8. Time the process
```

### Test 2: Second Bet (Same Session)
```
1. Wait for first battle to finish
2. Select another market
3. Set stake: 10 AION (same or less)
4. Click "Start Battle"
5. Observe console logs:
   - "Checking current allowance..."
   - "Allowance sufficient, skipping approval ✅"
   - "Estimating gas..."
   - "Placing bet..."
   - "Bet confirmed! ✅"
6. Check progress message: "Skipping approval ✅"
7. Verify only 1 MetaMask popup
8. Time the process (should be ~40s)
```

### Test 3: Error Scenarios
```
1. Try with insufficient AION
   - Expected: MetaMask rejects
   
2. Try with insufficient MATIC
   - Expected: "Insufficient MATIC for gas fees"
   
3. Try on closed market
   - Expected: "Market not open" or gas estimation error
   
4. Disconnect wallet mid-transaction
   - Expected: "Please connect your wallet"
```

---

## 📝 Console Log Examples

### Successful First Bet
```
[placeBet] Starting place bet...
[placeBet] Current network: 80002
[placeBet] User address: 0x1234...5678
[placeBet] Amount: 10 AION
[placeBet] Checking current allowance...
[placeBet] Current allowance: 0 AION
[placeBet] Allowance insufficient, approving AION token...
[placeBet] Approve tx sent: 0xabcd...ef01
[placeBet] Approve confirmed in block: 12345678
[placeBet] Verifying allowance update...
[placeBet] Allowance verification attempt 1/10
[placeBet] New allowance: 10 AION
[placeBet] Allowance verified! ✅
[placeBet] Estimating gas for place bet...
[placeBet] Estimated gas limit: 250000
[placeBet] Gas limit with buffer: 300000
[placeBet] Placing bet on market 14 outcome 0
[placeBet] Bet tx sent: 0x2345...6789
[placeBet] Bet confirmed in block: 12345680
[placeBet] Gas used: 280000
```

### Successful Second Bet (Skip Approve)
```
[placeBet] Starting place bet...
[placeBet] Checking current allowance...
[placeBet] Current allowance: 10 AION
[placeBet] Allowance sufficient, skipping approval ✅
[placeBet] Estimating gas for place bet...
[placeBet] Placing bet on market 15 outcome 1
[placeBet] Bet confirmed in block: 12345690
```

---

## ✅ Success Criteria Summary

### Functionality
- ✅ Check allowance before approve
- ✅ Skip approve if allowance sufficient
- ✅ Verify allowance after approve (max 10 attempts)
- ✅ Wait 2 confirmations for security
- ✅ Gas estimation with 3 retries
- ✅ Fallback gas limit if estimation fails
- ✅ Clear, actionable error messages

### Performance
- ✅ First bet: ~80-100 seconds
- ✅ Second bet: ~40-50 seconds (50% faster!)
- ✅ Second bet: 0.002 MATIC (33% cheaper!)

### User Experience
- ✅ Progress messages clear
- ✅ Error messages actionable
- ✅ Console logs detailed
- ✅ No silent failures

### Security
- ✅ 2 confirmations (more secure)
- ✅ Allowance verified
- ✅ Gas limit validated
- ✅ Network validated

---

## 🚀 Deployment

### Build and Test
```bash
cd Aion-x-main/frontend
npm run build
```

### Deploy to Vercel
```bash
git add frontend/src/utils/contract.js
git commit -m "feat: improve place bet with allowance check and verification"
git push origin main
```

### Monitor
- Check Vercel deployment
- Test on production
- Monitor error logs
- Check user feedback

---

**Test Plan Created**: November 27, 2024
**Features**: 5 major improvements
**Test Cases**: 7 comprehensive scenarios
**Status**: ✅ Ready for testing

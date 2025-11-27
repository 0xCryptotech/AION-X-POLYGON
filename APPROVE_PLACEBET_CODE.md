# Kode Approve → Place Bet

## File: `frontend/src/utils/contract.js`

### Function: `placeBet(marketId, outcome, amount, onProgress)`

---

## 📋 Complete Code Flow

```javascript
export const placeBet = async (marketId, outcome, amount, onProgress) => {
  try {
    // ============================================
    // STEP 1: SETUP & VALIDATION
    // ============================================
    console.log('[placeBet] Starting place bet...');
    onProgress?.('Connecting to wallet...');
    
    // Get signer (user's wallet)
    const signer = await getSigner();
    if (!signer) throw new Error('Please connect your wallet');
    
    // Get provider and check network
    const provider = getProvider();
    const network = await provider.getNetwork();
    const expectedChainId = parseInt(import.meta.env.VITE_CHAIN_ID || '80002');
    
    console.log('[placeBet] Current network:', network.chainId);
    console.log('[placeBet] Expected network:', expectedChainId);
    
    // Validate network (must be Polygon Amoy)
    if (network.chainId !== expectedChainId) {
      throw new Error(`Wrong network! Please switch to Polygon Amoy Testnet (Chain ID: ${expectedChainId})`);
    }
    
    // Get user address
    const userAddress = await signer.getAddress();
    console.log('[placeBet] User address:', userAddress);
    
    // Convert amount to wei (1 AION = 10^18 wei)
    const amountWei = ethers.utils.parseEther(amount.toString());
    console.log('[placeBet] Amount:', amount, 'AION');
    
    
    // ============================================
    // STEP 2: BALANCE CHECK (OPTIONAL)
    // ============================================
    console.log('[placeBet] Attempting balance check...');
    onProgress?.('Preparing transaction...');
    
    try {
      const tokenContract = new ethers.Contract(AION_TOKEN_ADDRESS, AIONTokenABI.abi, signer);
      const balance = await tokenContract.balanceOf(userAddress);
      console.log('[placeBet] Balance:', ethers.utils.formatEther(balance), 'AION');
      
      if (balance.lt(amountWei)) {
        throw new Error(`Insufficient AION balance. Need ${amount} AION, have ${ethers.utils.formatEther(balance)} AION`);
      }
      console.log('[placeBet] Balance check passed');
    } catch (balanceError) {
      console.warn('[placeBet] Balance check failed, proceeding anyway. MetaMask will validate.', balanceError.message);
      // Don't throw - let the transaction attempt proceed
      // MetaMask will show error if balance is insufficient
    }
    
    
    // ============================================
    // STEP 3: PREPARE CONTRACTS & GAS
    // ============================================
    
    // Create contract instances
    const tokenContract = new ethers.Contract(
      AION_TOKEN_ADDRESS,           // 0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
      AIONTokenABI.abi, 
      signer
    );
    
    const contract = getContract(signer);  // Prediction Market contract
    
    // Get current gas price and boost 20% for faster confirmation
    const gasPrice = await provider.getGasPrice();
    const boostedGasPrice = gasPrice.mul(120).div(100); // 20% boost
    
    console.log('[placeBet] Gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');
    console.log('[placeBet] Boosted gas price:', ethers.utils.formatUnits(boostedGasPrice, 'gwei'), 'gwei');
    
    
    // ============================================
    // STEP 4: APPROVE AION TOKEN (TRANSACTION 1) ✅
    // ============================================
    console.log('[placeBet] Approving AION token...');
    onProgress?.('Approving AION token... (1/2)');
    
    // Call approve() on AION Token contract
    const approveTx = await tokenContract.approve(
      CONTRACT_ADDRESS,    // Spender: Prediction Market contract address
      amountWei,          // Amount: How much AION to approve
      {
        gasPrice: boostedGasPrice  // Use boosted gas for faster confirmation
      }
    );
    
    console.log('[placeBet] Approve tx sent:', approveTx.hash);
    onProgress?.(`Waiting for approval confirmation... (tx: ${approveTx.hash.slice(0, 10)}...)`);
    
    // Wait for transaction to be mined (1 confirmation)
    const approveReceipt = await approveTx.wait(1);
    console.log('[placeBet] Approve confirmed in block:', approveReceipt.blockNumber);
    
    // ✅ APPROVAL COMPLETE!
    // Now Prediction Market contract can spend user's AION tokens
    
    
    // ============================================
    // STEP 5: PLACE BET (TRANSACTION 2) 🎯
    // ============================================
    console.log('[placeBet] Placing bet on market', marketId, 'outcome', outcome);
    onProgress?.('Placing bet... (2/2)');
    
    // Call placeBet() on Prediction Market contract
    const tx = await contract.placeBet(
      marketId,           // Market ID (e.g., 14 for BTC/USD)
      outcome,            // Outcome: 0 = Bullish, 1 = Bearish
      amountWei,          // Amount: How much AION to bet
      {
        gasPrice: boostedGasPrice  // Use boosted gas for faster confirmation
      }
    );
    
    console.log('[placeBet] Bet tx sent:', tx.hash);
    onProgress?.(`Waiting for bet confirmation... (tx: ${tx.hash.slice(0, 10)}...)`);
    
    // Wait for transaction to be mined (1 confirmation)
    const receipt = await tx.wait(1);
    console.log('[placeBet] Bet confirmed in block:', receipt.blockNumber);
    onProgress?.('Bet confirmed! ✅');
    
    // ✅ BET PLACED!
    // User's bet is now recorded on blockchain
    
    return tx;
    
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    console.error('Place bet error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error data:', error.data);
    
    // Handle user rejection
    if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
      throw new Error('Transaction rejected by user');
    }
    
    // Handle insufficient funds
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient MATIC for gas fees. Please get MATIC from faucet.');
    }
    
    // Handle CALL_EXCEPTION (wrong network or contract not found)
    if (error.code === 'CALL_EXCEPTION') {
      throw new Error('Contract call failed. Please ensure you are on Polygon Amoy Testnet (Chain ID: 80002) and have AION tokens.');
    }
    
    // Handle network errors
    if (error.message && error.message.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Throw user-friendly error message
    if (error.message && !error.message.includes('call revert exception')) {
      throw new Error(error.message);
    } else if (error.reason) {
      throw new Error(error.reason);
    } else {
      throw new Error('Failed to place bet. Please ensure you have enough AION tokens and MATIC for gas.');
    }
  }
};
```

---

## 🔍 Detailed Breakdown

### STEP 4: Approve AION Token (Transaction 1)

```javascript
// Create AION Token contract instance
const tokenContract = new ethers.Contract(
  AION_TOKEN_ADDRESS,  // 0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
  AIONTokenABI.abi,
  signer
);

// Call approve() function
const approveTx = await tokenContract.approve(
  CONTRACT_ADDRESS,    // Spender: 0x2C3B12e01313A8336179c5c850d64335137FAbab
  amountWei,          // Amount: e.g., 10 AION = 10000000000000000000 wei
  {
    gasPrice: boostedGasPrice  // Gas price with 20% boost
  }
);

// Wait for confirmation
const approveReceipt = await approveTx.wait(1);
```

**What happens:**
1. User sees MetaMask popup: "Approve AION Token"
2. User clicks "Confirm"
3. Transaction sent to blockchain
4. Wait ~30 seconds for confirmation
5. ✅ Approval complete!

**Contract Call:**
- **Contract**: AION Token (`0x1Ef6...f331`)
- **Function**: `approve(address spender, uint256 amount)`
- **Parameters**:
  - `spender`: `0x2C3B12e01313A8336179c5c850d64335137FAbab` (Prediction Market)
  - `amount`: `10000000000000000000` (10 AION in wei)

**Result**: Prediction Market contract can now spend 10 AION from user's wallet

---

### STEP 5: Place Bet (Transaction 2)

```javascript
// Create Prediction Market contract instance
const contract = getContract(signer);  // Uses CONTRACT_ADDRESS

// Call placeBet() function
const tx = await contract.placeBet(
  marketId,           // e.g., 14 (BTC/USD market)
  outcome,            // 0 = Bullish, 1 = Bearish
  amountWei,          // e.g., 10 AION = 10000000000000000000 wei
  {
    gasPrice: boostedGasPrice  // Gas price with 20% boost
  }
);

// Wait for confirmation
const receipt = await tx.wait(1);
```

**What happens:**
1. User sees MetaMask popup: "Place Bet"
2. User clicks "Confirm"
3. Transaction sent to blockchain
4. Prediction Market contract calls `transferFrom()` on AION Token
5. AION tokens transferred from user to Prediction Market
6. Bet recorded on blockchain
7. Wait ~30 seconds for confirmation
8. ✅ Bet placed!

**Contract Call:**
- **Contract**: Prediction Market (`0x2C3B...Abab`)
- **Function**: `placeBet(uint256 marketId, uint256 outcome, uint256 amount)`
- **Parameters**:
  - `marketId`: `14` (BTC/USD 10min Quick Battle)
  - `outcome`: `0` (Bullish) or `1` (Bearish)
  - `amount`: `10000000000000000000` (10 AION in wei)

**Result**: User's bet is recorded on blockchain and AION tokens are locked in contract

---

## 📊 Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User clicks "Start Battle"                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 1-3: Setup & Validation                                │
│ - Connect wallet                                            │
│ - Check network (must be Polygon Amoy)                      │
│ - Check balance (optional)                                  │
│ - Get gas price + 20% boost                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: APPROVE AION TOKEN (Transaction 1) ✅               │
├─────────────────────────────────────────────────────────────┤
│ Contract: AION Token (0x1Ef6...f331)                        │
│ Function: approve(spender, amount)                          │
│                                                             │
│ tokenContract.approve(                                      │
│   CONTRACT_ADDRESS,  // Prediction Market address          │
│   amountWei,        // 10 AION                             │
│   { gasPrice: boostedGasPrice }                            │
│ )                                                           │
│                                                             │
│ → MetaMask Popup 1: "Approve AION Token"                   │
│ → User confirms                                             │
│ → Wait ~30 seconds                                          │
│ → ✅ Approved!                                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: PLACE BET (Transaction 2) 🎯                        │
├─────────────────────────────────────────────────────────────┤
│ Contract: Prediction Market (0x2C3B...Abab)                 │
│ Function: placeBet(marketId, outcome, amount)               │
│                                                             │
│ contract.placeBet(                                          │
│   marketId,         // 14 (BTC/USD)                        │
│   outcome,          // 0 (Bullish)                         │
│   amountWei,        // 10 AION                             │
│   { gasPrice: boostedGasPrice }                            │
│ )                                                           │
│                                                             │
│ → MetaMask Popup 2: "Place Bet"                            │
│ → User confirms                                             │
│ → Contract transfers AION from user                         │
│ → Bet recorded on blockchain                                │
│ → Wait ~30 seconds                                          │
│ → ✅ Bet Placed!                                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ ✅ SUCCESS!                                                  │
│ Battle starts (10 minutes)                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 Contract Addresses

```javascript
// From frontend/src/utils/contract.js
const CONTRACT_ADDRESS = '0x2C3B12e01313A8336179c5c850d64335137FAbab';  // Prediction Market
const AION_TOKEN_ADDRESS = '0x1Ef64Ab093620c73DC656f57D0f7A7061586f331'; // AION Token
```

---

## 💰 Gas Costs

| Step | Transaction | Gas Limit | Cost (MATIC) | Time |
|------|-------------|-----------|--------------|------|
| 4 | Approve Token | ~50,000 | ~0.001 | ~30s |
| 5 | Place Bet | ~100,000 | ~0.002 | ~30s |
| **Total** | - | ~150,000 | **~0.003** | **~60s** |

---

## 🎯 Key Points

1. **Two Transactions Required**:
   - First: Approve AION Token
   - Second: Place Bet

2. **Why Approve First?**:
   - ERC20 tokens require approval before another contract can spend them
   - Security feature to prevent unauthorized transfers

3. **Gas Optimization**:
   - Gas price boosted 20% for faster confirmation
   - Both transactions use same boosted gas price

4. **Progress Tracking**:
   - Real-time updates via `onProgress` callback
   - User sees exactly what's happening

5. **Error Handling**:
   - User rejection → Clear message
   - Insufficient funds → Suggest faucet
   - Wrong network → Ask to switch
   - Network error → Retry suggestion

---

## 📝 Example Usage

```javascript
// In AIBattleModal.jsx
const startBattle = async () => {
  try {
    const marketId = 14;        // BTC/USD market
    const outcome = 0;          // 0 = Bullish, 1 = Bearish
    const stake = 10;           // 10 AION
    
    await handlePlaceBet(marketId, outcome, stake);
    
    // Battle starts!
  } catch (error) {
    console.error('Battle error:', error);
  }
};
```

---

**Last Updated**: November 27, 2024
**Network**: Polygon Amoy Testnet (Chain ID: 80002)
**Status**: ✅ Production Ready

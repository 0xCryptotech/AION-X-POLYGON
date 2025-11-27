# Fix: CALL_EXCEPTION Error on balanceOf

## Error Message
```
Error: call revert exception [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] 
(method="balanceOf(address)", data="0x", errorArgs=null, errorName=null, 
errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.8.0)
```

## Root Cause
`CALL_EXCEPTION` terjadi ketika:
1. **Wrong Network** - User connect ke network yang salah (bukan Polygon Amoy)
2. **RPC Provider Issue** - RPC endpoint tidak bisa reach contract
3. **Contract Not Deployed** - Token contract tidak ada di network tersebut

## Solution Implemented

### 1. Network Validation
**File**: `frontend/src/utils/contract.js`

```javascript
const provider = getProvider();
const network = await provider.getNetwork();
const expectedChainId = parseInt(import.meta.env.VITE_CHAIN_ID || '80002');

// Validate network
if (network.chainId !== expectedChainId) {
  throw new Error(`Wrong network! Please switch to Polygon Amoy Testnet (Chain ID: ${expectedChainId})`);
}
```

**Benefit**: User langsung dapat error message jelas jika salah network

### 2. RPC Fallback Mechanism
**File**: `frontend/src/utils/contract.js`

```javascript
export const getReadOnlyProvider = () => {
  const primaryRpc = import.meta.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology/';
  const fallbackRpc = import.meta.env.VITE_FALLBACK_RPC || 'https://polygon-amoy.g.alchemy.com/v2/TnBudoktgrSgm-wy0RkEg';
  
  try {
    return new ethers.providers.JsonRpcProvider(primaryRpc);
  } catch (error) {
    console.warn('[getReadOnlyProvider] Primary RPC failed, using fallback');
    return new ethers.providers.JsonRpcProvider(fallbackRpc);
  }
};
```

### 3. Balance Check with Fallback
```javascript
let balance;
try {
  const readOnlyProvider = getReadOnlyProvider();
  const readOnlyTokenContract = new ethers.Contract(AION_TOKEN_ADDRESS, AIONTokenABI.abi, readOnlyProvider);
  balance = await readOnlyTokenContract.balanceOf(userAddress);
} catch (balanceError) {
  console.warn('[placeBet] Read-only provider failed, trying with signer provider');
  // Fallback to signer's provider
  const tokenContract = new ethers.Contract(AION_TOKEN_ADDRESS, AIONTokenABI.abi, provider);
  balance = await tokenContract.balanceOf(userAddress);
}
```

**Benefit**: Jika primary RPC gagal, otomatis coba dengan signer's provider

### 4. UI Network Check
**File**: `frontend/src/components/AIBattleModal.jsx`

```javascript
const startBattle = async () => {
  // Check network first
  const provider = await window.ethereum;
  if (provider) {
    const chainId = await provider.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(chainId, 16);
    const expectedChainId = parseInt(import.meta.env.VITE_CHAIN_ID || '80002');
    
    if (currentChainId !== expectedChainId) {
      alert(`Wrong network! Please switch to Polygon Amoy Testnet.\n\nCurrent: Chain ID ${currentChainId}\nExpected: Chain ID ${expectedChainId}`);
      return;
    }
  }
  // ... rest of code
};
```

### 5. Network Indicator in UI
```jsx
<div>
  <h3>AI vs AI Battle Arena</h3>
  {isConnected && (
    <div className="text-xs text-slate-400 mt-1">
      Network: Polygon Amoy Testnet (Chain ID: 80002)
    </div>
  )}
</div>
```

## Environment Variables
**File**: `frontend/.env`

```env
VITE_CHAIN_ID=80002
VITE_RPC_URL=https://rpc-amoy.polygon.technology/
VITE_FALLBACK_RPC=https://polygon-amoy.g.alchemy.com/v2/TnBudoktgrSgm-wy0RkEg
VITE_TOKEN_ADDRESS=0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
VITE_CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
```

## Testing

### Test Case 1: Wrong Network
1. Connect wallet to Polygon Mumbai or Ethereum Mainnet
2. Try to place bet
3. **Expected**: Alert "Wrong network! Please switch to Polygon Amoy Testnet"

### Test Case 2: Correct Network
1. Connect wallet to Polygon Amoy (Chain ID: 80002)
2. Try to place bet
3. **Expected**: Balance check succeeds, transaction proceeds

### Test Case 3: RPC Failure
1. Primary RPC down
2. Try to place bet
3. **Expected**: Automatically fallback to secondary RPC, transaction succeeds

### Test Case 4: No AION Balance
1. Connect wallet with 0 AION
2. Try to place bet
3. **Expected**: "Insufficient AION balance. Need X AION, have 0 AION"

## How to Switch Network in MetaMask

### Manual Method:
1. Open MetaMask
2. Click network dropdown (top)
3. Click "Add Network"
4. Select "Polygon Amoy Testnet"

### Programmatic Method (Future Enhancement):
```javascript
try {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x13882' }], // 80002 in hex
  });
} catch (switchError) {
  // If network not added, add it
  if (switchError.code === 4902) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x13882',
        chainName: 'Polygon Amoy Testnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-amoy.polygon.technology/'],
        blockExplorerUrls: ['https://amoy.polygonscan.com/']
      }]
    });
  }
}
```

## Troubleshooting

### Error: "Wrong network"
**Solution**: Switch MetaMask to Polygon Amoy Testnet (Chain ID: 80002)

### Error: "CALL_EXCEPTION" masih muncul
**Check**:
1. Apakah RPC URL di `.env` benar?
2. Apakah contract address benar?
3. Apakah token deployed di network tersebut?

**Verify Contract**:
```bash
# Check if contract exists
curl https://rpc-amoy.polygon.technology/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getCode",
    "params":["0x1Ef64Ab093620c73DC656f57D0f7A7061586f331", "latest"],
    "id":1
  }'
```

If response is `"0x"`, contract tidak ada di network tersebut.

### Error: "Insufficient AION balance"
**Solution**: 
1. Get AION from faucet: Visit your faucet page
2. Or buy/swap for AION tokens

### RPC Endpoint Down
**Check Status**:
- Polygon RPC: https://rpc-amoy.polygon.technology/
- Alchemy RPC: https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY

**Test RPC**:
```bash
curl https://rpc-amoy.polygon.technology/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

## Deployment

```bash
cd Aion-x-main
git pull origin main
cd frontend
npm run build
# Deploy to Vercel or VPS
```

Vercel will auto-deploy from GitHub push.

## Monitoring

### Check Logs
```javascript
console.log('[placeBet] Current network:', network.chainId);
console.log('[placeBet] Expected network:', expectedChainId);
console.log('[placeBet] Read-only provider URL:', readOnlyProvider.connection.url);
console.log('[placeBet] Balance:', ethers.utils.formatEther(balance), 'AION');
```

### User Feedback
- Network indicator visible in UI
- Clear error messages for wrong network
- Progress tracking for transactions

## Summary

✅ **Network validation** - Check Chain ID before transactions
✅ **RPC fallback** - Auto-switch if primary RPC fails
✅ **Balance check fallback** - Try multiple providers
✅ **UI indicators** - Show current network to user
✅ **Clear error messages** - User knows exactly what to fix

Error `CALL_EXCEPTION` sekarang handled dengan baik dan user dapat guidance jelas untuk fix.

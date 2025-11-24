# Update VPS Backend

## New Contract Addresses

- **PredictionMarket**: `0x276c2de4D162875be9C9DF96f68dD80Be54E2838` (with 2% fee)
- **Staking**: `0xd2B8aCD1Da99CFe52dD07DAca27536e6dB2D46F2`

## Update Commands

```bash
# SSH to VPS
ssh root@152.42.199.50

# Navigate to backend
cd /root/aion-backend

# Pull latest code
git pull origin main

# Restart PM2
pm2 restart aion-backend

# Check logs
pm2 logs aion-backend --lines 50
```

## Verify Integration

```bash
# Check if backend is using new contract
pm2 logs aion-backend | grep "0x276c2de4"

# Should see new contract address in logs
```

## What Changed

1. **Contract Address**: Updated to new market with fee mechanism
2. **Fee Structure**: 2% deducted on resolution
3. **Staking Integration**: Fees automatically sent to stakers

## Testing

After update, create a test battle:
1. Visit https://aion-x.vercel.app/battle
2. Start AI vs AI battle
3. Wait 10 minutes for resolution
4. Check staking contract received 2% fee
5. Verify winner got 98% of pool

---

**Run these commands now to update VPS!**

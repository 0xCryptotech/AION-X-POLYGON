# 🚀 Migrasi BNB → Polygon di VPS (Simple & Cepat)

## 📋 Overview
Migrasi dari BNB Chain ke Polygon Amoy di VPS yang sudah running.
**Estimasi waktu: 15-30 menit**

## 🔧 Step-by-Step

### 1. Backup (Safety First) - 2 menit
```bash
# SSH ke VPS
ssh user@your-vps-ip

# Backup .env files
cd /var/www/aion-x
cp backend/.env backend/.env.bnb.backup
cp frontend/.env frontend/.env.bnb.backup

# Backup database (optional)
cp backend/prisma/dev.db backend/prisma/dev.db.bnb.backup
```

### 2. Update Backend .env - 1 menit
```bash
cd /var/www/aion-x/backend
nano .env
```

**Ganti:**
```env
# OLD (BNB)
PROVIDER_URL=https://bsc-testnet.public.blastapi.io
CONTRACT_ADDRESS=0x...OLD_BNB_ADDRESS...

# NEW (Polygon)
PROVIDER_URL=https://rpc-amoy.polygon.technology/
OWNER_PRIVATE_KEY=0xef26e534879535e05ec6120e2fcae1d65b88c5fcb52d5f7a98531cd2ffb134e1
CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
PORT=4000
```

### 3. Update Frontend .env - 1 menit
```bash
cd /var/www/aion-x/frontend
nano .env
```

**Ganti:**
```env
VITE_CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
VITE_TOKEN_ADDRESS=0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
VITE_STAKING_ADDRESS=0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5
VITE_FAUCET_ADDRESS=0x765622d95D072c00209Cd87e60EfCf472bDF423D
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_CHAIN_ID=80002
```

### 4. Reset Database - 1 menit
```bash
cd /var/www/aion-x/backend

# Delete old database
rm prisma/dev.db

# Create fresh database
npx prisma migrate reset --force
# atau
npx prisma db push
```

### 5. Update ABI Files - 2 menit
```bash
# Copy ABI dari hardhat ke backend
cd /var/www/aion-x
cp hardhat/artifacts/contracts/PredictionMarketAION.sol/PredictionMarketAION.json backend/abi/PredictionMarket.json

# Copy ABI ke frontend
cp hardhat/artifacts/contracts/PredictionMarketAION.sol/PredictionMarketAION.json frontend/abi/PredictionMarket.json
cp hardhat/artifacts/contracts/AIONToken.sol/AIONToken.json frontend/abi/AIONToken.json
cp hardhat/artifacts/contracts/AIONFaucet.sol/AIONFaucet.json frontend/abi/AIONFaucet.json
```

### 6. Rebuild Frontend - 3 menit
```bash
cd /var/www/aion-x/frontend
npm run build

# Copy ke nginx
sudo cp -r dist/* /var/www/html/
```

### 7. Restart Backend - 1 menit
```bash
pm2 restart aion-backend
pm2 restart aion-auto-resolve  # jika ada

# Check logs
pm2 logs aion-backend --lines 50
```

### 8. Test - 5 menit
```bash
# Test backend
curl https://api.yourdomain.com/health

# Test frontend
# Buka browser: https://yourdomain.com
# Connect wallet → Switch to Polygon Amoy
# Test faucet claim
# Test place bet
```

## ✅ Checklist Cepat

```bash
# One-liner untuk cek semua
cd /var/www/aion-x/backend && \
grep "PROVIDER_URL" .env && \
grep "CONTRACT_ADDRESS" .env && \
pm2 status && \
curl http://localhost:4000/health
```

## 🔥 Quick Commands (Copy-Paste)

### Update Backend .env
```bash
cat > /var/www/aion-x/backend/.env << 'EOF'
PROVIDER_URL=https://rpc-amoy.polygon.technology/
OWNER_PRIVATE_KEY=0xef26e534879535e05ec6120e2fcae1d65b88c5fcb52d5f7a98531cd2ffb134e1
CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
PORT=4000
EOF
```

### Update Frontend .env
```bash
cat > /var/www/aion-x/frontend/.env << 'EOF'
VITE_CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
VITE_TOKEN_ADDRESS=0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
VITE_STAKING_ADDRESS=0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5
VITE_FAUCET_ADDRESS=0x765622d95D072c00209Cd87e60EfCf472bDF423D
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_CHAIN_ID=80002
EOF
```

### Full Migration Script
```bash
#!/bin/bash
cd /var/www/aion-x

# Backup
cp backend/.env backend/.env.backup
cp frontend/.env frontend/.env.backup

# Update backend .env (paste content above)
# Update frontend .env (paste content above)

# Reset DB
cd backend
rm prisma/dev.db
npx prisma db push

# Rebuild frontend
cd ../frontend
npm run build
sudo cp -r dist/* /var/www/html/

# Restart
pm2 restart all

echo "✅ Migration complete!"
pm2 status
```

## 🎯 Yang Berubah

| Item | BNB Chain | Polygon Amoy |
|------|-----------|--------------|
| RPC | bsc-testnet | rpc-amoy.polygon.technology |
| Chain ID | 97 | 80002 |
| Token | 0x...old | 0x1Ef64...331 |
| Market | 0x...old | 0x2C3B1...bab |
| Staking | 0x...old | 0x16a22...7a5 |
| Faucet | 0x...old | 0x76562...23D |

## 🐛 Troubleshooting

### Backend tidak start
```bash
pm2 logs aion-backend
# Check error, biasanya .env atau database issue
```

### Frontend tidak connect wallet
- Clear browser cache
- Switch MetaMask ke Polygon Amoy (Chain ID: 80002)
- Add Polygon Amoy RPC jika belum ada

### Database error
```bash
cd backend
rm prisma/dev.db
npx prisma db push
pm2 restart aion-backend
```

## 📝 Notes

- ⚠️ User perlu **switch network** di MetaMask ke Polygon Amoy
- ⚠️ Balance AION akan **reset** (claim dari faucet lagi)
- ⚠️ History battles **hilang** (fresh start)
- ✅ Semua fitur tetap sama, hanya chain berbeda
- ✅ Gas fee lebih murah di Polygon

## 🎉 Done!

Total waktu: **15-30 menit**
Setelah selesai, AION-X sudah running di Polygon Amoy! 🚀

# 🚀 Deploy Instructions - VPS 152.42.199.50

## 📋 Langkah Deploy

### 1. Upload Files ke VPS

**Option A: Via Git (Recommended)**
```bash
# Di VPS
ssh root@152.42.199.50

cd /var/www/aion-x
git pull origin main
```

**Option B: Via SCP (Manual)**
```bash
# Di local machine
cd "/Users/idcuq/Documents/AION-X POLYGON/Aion-x-main"

# Upload migration script
scp migrate-to-polygon.sh root@152.42.199.50:/var/www/aion-x/

# Upload hardhat artifacts (ABI files)
scp -r hardhat/artifacts root@152.42.199.50:/var/www/aion-x/hardhat/

# Upload updated frontend files
scp -r frontend/src root@152.42.199.50:/var/www/aion-x/frontend/
```

### 2. Run Migration Script

```bash
# SSH ke VPS
ssh root@152.42.199.50

# Masuk ke project directory
cd /var/www/aion-x

# Make script executable
chmod +x migrate-to-polygon.sh

# Run migration
./migrate-to-polygon.sh
```

### 3. Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check backend logs
pm2 logs aion-backend --lines 50

# Test backend API
curl http://localhost:4000/health

# Test from outside
curl http://152.42.199.50:4000/health
```

### 4. Test Frontend

Open browser:
- **Frontend**: http://152.42.199.50
- **Backend API**: http://152.42.199.50:4000

## 🔧 Manual Steps (If Script Fails)

### Update Backend .env
```bash
cd /var/www/aion-x/backend
nano .env
```
Paste:
```
PROVIDER_URL=https://rpc-amoy.polygon.technology/
OWNER_PRIVATE_KEY=0xef26e534879535e05ec6120e2fcae1d65b88c5fcb52d5f7a98531cd2ffb134e1
CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
PORT=4000
```

### Update Frontend .env
```bash
cd /var/www/aion-x/frontend
nano .env
```
Paste:
```
VITE_CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
VITE_TOKEN_ADDRESS=0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
VITE_STAKING_ADDRESS=0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5
VITE_FAUCET_ADDRESS=0x765622d95D072c00209Cd87e60EfCf472bDF423D
VITE_BACKEND_URL=http://152.42.199.50:4000
VITE_CHAIN_ID=80002
```

### Reset Database
```bash
cd /var/www/aion-x/backend
rm prisma/dev.db
npx prisma db push
```

### Rebuild Frontend
```bash
cd /var/www/aion-x/frontend
npm run build
sudo cp -r dist/* /var/www/html/
```

### Restart Services
```bash
pm2 restart all
pm2 logs
```

## 🐛 Troubleshooting

### Backend tidak start
```bash
pm2 logs aion-backend
# Check error di logs
```

### Frontend blank/error
```bash
# Check nginx error log
sudo tail -f /var/log/nginx/error.log

# Rebuild frontend
cd /var/www/aion-x/frontend
rm -rf dist node_modules
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

### Database error
```bash
cd /var/www/aion-x/backend
rm -rf prisma/dev.db prisma/migrations
npx prisma migrate dev --name init
# atau
npx prisma db push
```

### Port 4000 tidak accessible
```bash
# Check firewall
sudo ufw status
sudo ufw allow 4000

# Check nginx config
sudo nano /etc/nginx/sites-available/default
# Pastikan ada proxy_pass ke localhost:4000
```

## 📱 MetaMask Setup

### Add Polygon Amoy Network
```
Network Name: Polygon Amoy Testnet
RPC URL: https://rpc-amoy.polygon.technology/
Chain ID: 80002
Currency Symbol: MATIC
Block Explorer: https://amoy.polygonscan.com/
```

### Get Test MATIC
https://faucet.polygon.technology/

## ✅ Post-Deploy Checklist

- [ ] Backend running (pm2 status)
- [ ] Frontend accessible (http://152.42.199.50)
- [ ] MetaMask connected to Polygon Amoy
- [ ] Faucet claim working
- [ ] Place bet working
- [ ] Pyth Network price feed working
- [ ] Battle history showing

## 📞 Quick Commands

```bash
# SSH
ssh root@152.42.199.50

# Check services
pm2 status
pm2 logs aion-backend

# Restart all
pm2 restart all

# Check backend
curl http://localhost:4000/health

# Check frontend
curl http://152.42.199.50

# View logs
pm2 logs --lines 100
```

## 🎯 Contract Addresses (Polygon Amoy)

```
Token:      0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
Market:     0x2C3B12e01313A8336179c5c850d64335137FAbab
Staking:    0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5
Faucet:     0x765622d95D072c00209Cd87e60EfCf472bDF423D
```

## 🔗 Links

- Frontend: http://152.42.199.50
- Backend: http://152.42.199.50:4000
- Health: http://152.42.199.50:4000/health
- PolygonScan: https://amoy.polygonscan.com/

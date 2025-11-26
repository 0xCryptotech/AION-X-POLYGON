# ✅ VPS Deployment Checklist - AION-X

## 📋 Contract Status

### ✅ Smart Contracts (Deployed on Polygon Amoy)

| Contract | Address | Status |
|----------|---------|--------|
| **AIONToken** | `0x1Ef64Ab093620c73DC656f57D0f7A7061586f331` | ✅ Deployed |
| **PredictionMarket** | `0x2C3B12e01313A8336179c5c850d64335137FAbab` | ✅ Deployed |
| **AIONStaking** | `0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5` | ✅ Deployed |
| **AIONFaucet** | `0x765622d95D072c00209Cd87e60EfCf472bDF423D` | ✅ Deployed |

### ✅ Contract Features

**PredictionMarketAION.sol:**
- ✅ Create markets (AI vs AI, AI vs Human, Human vs Human)
- ✅ Place bets with AION token
- ✅ Auto-close markets by time
- ✅ Resolve markets with oracle
- ✅ 2% platform fee to staking contract
- ✅ Claim winnings
- ✅ Owner withdraw

**AIONToken.sol:**
- ✅ ERC20 standard
- ✅ 1 Billion supply
- ✅ Transfer, approve, transferFrom

**AIONStaking.sol:**
- ✅ Stake AION (min 100 AION)
- ✅ 7 days lock period
- ✅ Revenue sharing from platform fees
- ✅ Calculate APY
- ✅ Unstake with rewards

**AIONFaucet.sol:**
- ✅ Claim 100 AION per 24 hours
- ✅ Cooldown system
- ✅ Owner configurable

## 🚀 VPS Deployment Requirements

### 1. Server Specs (Minimum)
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Ubuntu 22.04 LTS

### 2. Software Requirements
```bash
# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 (Process Manager)
sudo npm install -g pm2

# Nginx (Reverse Proxy)
sudo apt install nginx

# Git
sudo apt install git
```

### 3. Environment Variables

**Backend (.env):**
```env
PROVIDER_URL=https://rpc-amoy.polygon.technology/
OWNER_PRIVATE_KEY=0xef26e534879535e05ec6120e2fcae1d65b88c5fcb52d5f7a98531cd2ffb134e1
CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
PORT=4000
```

**Frontend (.env):**
```env
VITE_CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
VITE_TOKEN_ADDRESS=0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
VITE_STAKING_ADDRESS=0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5
VITE_FAUCET_ADDRESS=0x765622d95D072c00209Cd87e60EfCf472bDF423D
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_CHAIN_ID=80002
```

## 📦 Deployment Steps

### Step 1: Clone Repository
```bash
cd /var/www
git clone <your-repo-url> aion-x
cd aion-x
```

### Step 2: Deploy Backend
```bash
cd backend
npm install
npm run build  # if using TypeScript

# Create .env file
nano .env
# Paste backend env variables

# Start with PM2
pm2 start src/index.ts --name aion-backend --interpreter ts-node
pm2 save
pm2 startup
```

### Step 3: Deploy Frontend
```bash
cd ../frontend
npm install

# Create .env file
nano .env
# Paste frontend env variables (update VITE_BACKEND_URL)

# Build
npm run build

# Serve with Nginx
sudo cp -r dist/* /var/www/html/
```

### Step 4: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/aion-x
```

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/aion-x /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL Certificate (Optional but Recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

### Step 6: Auto-Resolve Service (Optional)
```bash
cd backend
pm2 start autoResolve.js --name aion-auto-resolve
pm2 save
```

## 🔧 Post-Deployment

### Monitor Services
```bash
pm2 status
pm2 logs aion-backend
pm2 logs aion-auto-resolve
```

### Check Nginx
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Firewall
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## ✅ Final Checklist

- [ ] All 4 contracts deployed on Polygon Amoy
- [ ] Backend running on VPS (PM2)
- [ ] Frontend built and served (Nginx)
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Auto-resolve service running
- [ ] Firewall configured
- [ ] Domain DNS pointed to VPS IP
- [ ] Test wallet connection
- [ ] Test Pyth Network price feed
- [ ] Test contract interactions
- [ ] Monitor logs for errors

## 🎯 Contract Verification (Optional)

Verify contracts on PolygonScan:
```bash
cd hardhat
npx hardhat verify --network amoy 0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
npx hardhat verify --network amoy 0x2C3B12e01313A8336179c5c850d64335137FAbab <token_address>
npx hardhat verify --network amoy 0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5 <token_address>
npx hardhat verify --network amoy 0x765622d95D072c00209Cd87e60EfCf472bDF423D <token_address>
```

## 📊 Monitoring

- Backend API: `https://api.yourdomain.com/health`
- Frontend: `https://yourdomain.com`
- PM2 Dashboard: `pm2 monit`
- Nginx Logs: `/var/log/nginx/`

## 🔐 Security Notes

- ⚠️ **NEVER commit private keys to git**
- ⚠️ Use environment variables for sensitive data
- ⚠️ Keep server updated: `sudo apt update && sudo apt upgrade`
- ⚠️ Use strong SSH keys, disable password auth
- ⚠️ Regular backups of database and .env files

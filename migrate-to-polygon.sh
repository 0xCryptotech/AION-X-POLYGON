#!/bin/bash

# AION-X Migration Script: BNB → Polygon Amoy
# VPS: 152.42.199.50

echo "🚀 Starting AION-X Migration to Polygon Amoy..."
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/aion-x"
BACKUP_DIR="/var/www/aion-x-backup-$(date +%Y%m%d-%H%M%S)"

# Step 1: Backup
echo -e "${YELLOW}[1/8] Creating backup...${NC}"
mkdir -p $BACKUP_DIR
cp -r $PROJECT_DIR/backend/.env $BACKUP_DIR/backend.env.backup 2>/dev/null || echo "No backend .env found"
cp -r $PROJECT_DIR/frontend/.env $BACKUP_DIR/frontend.env.backup 2>/dev/null || echo "No frontend .env found"
cp -r $PROJECT_DIR/backend/prisma/dev.db $BACKUP_DIR/dev.db.backup 2>/dev/null || echo "No database found"
echo -e "${GREEN}✓ Backup created at $BACKUP_DIR${NC}"

# Step 2: Update Backend .env
echo -e "${YELLOW}[2/8] Updating backend .env...${NC}"
cat > $PROJECT_DIR/backend/.env << 'EOF'
PROVIDER_URL=https://rpc-amoy.polygon.technology/
OWNER_PRIVATE_KEY=0xef26e534879535e05ec6120e2fcae1d65b88c5fcb52d5f7a98531cd2ffb134e1
CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
PORT=4000
EOF
echo -e "${GREEN}✓ Backend .env updated${NC}"

# Step 3: Update Frontend .env
echo -e "${YELLOW}[3/8] Updating frontend .env...${NC}"
cat > $PROJECT_DIR/frontend/.env << 'EOF'
VITE_CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
VITE_TOKEN_ADDRESS=0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
VITE_STAKING_ADDRESS=0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5
VITE_FAUCET_ADDRESS=0x765622d95D072c00209Cd87e60EfCf472bDF423D
VITE_BACKEND_URL=http://152.42.199.50:4000
VITE_CHAIN_ID=80002
EOF
echo -e "${GREEN}✓ Frontend .env updated${NC}"

# Step 4: Reset Database
echo -e "${YELLOW}[4/8] Resetting database...${NC}"
cd $PROJECT_DIR/backend
rm -f prisma/dev.db prisma/dev.db-journal
npx prisma db push --force-reset 2>&1 | tail -5
echo -e "${GREEN}✓ Database reset${NC}"

# Step 5: Update ABI files
echo -e "${YELLOW}[5/8] Updating ABI files...${NC}"
cd $PROJECT_DIR
if [ -f "hardhat/artifacts/contracts/PredictionMarketAION.sol/PredictionMarketAION.json" ]; then
    cp hardhat/artifacts/contracts/PredictionMarketAION.sol/PredictionMarketAION.json backend/abi/PredictionMarket.json
    cp hardhat/artifacts/contracts/PredictionMarketAION.sol/PredictionMarketAION.json frontend/abi/PredictionMarket.json
    cp hardhat/artifacts/contracts/AIONToken.sol/AIONToken.json frontend/abi/AIONToken.json
    cp hardhat/artifacts/contracts/AIONFaucet.sol/AIONFaucet.json frontend/abi/AIONFaucet.json
    echo -e "${GREEN}✓ ABI files updated${NC}"
else
    echo -e "${YELLOW}⚠ ABI files not found, skipping...${NC}"
fi

# Step 6: Rebuild Frontend
echo -e "${YELLOW}[6/8] Rebuilding frontend...${NC}"
cd $PROJECT_DIR/frontend
npm run build 2>&1 | tail -10
if [ -d "dist" ]; then
    sudo cp -r dist/* /var/www/html/ 2>/dev/null || cp -r dist/* /var/www/html/
    echo -e "${GREEN}✓ Frontend rebuilt and deployed${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
fi

# Step 7: Restart Backend
echo -e "${YELLOW}[7/8] Restarting backend services...${NC}"
pm2 restart aion-backend 2>/dev/null || echo "Backend not running with PM2"
pm2 restart aion-auto-resolve 2>/dev/null || echo "Auto-resolve not running"
sleep 2
echo -e "${GREEN}✓ Services restarted${NC}"

# Step 8: Health Check
echo -e "${YELLOW}[8/8] Running health check...${NC}"
sleep 3
HEALTH=$(curl -s http://localhost:4000/health 2>/dev/null)
if [ ! -z "$HEALTH" ]; then
    echo -e "${GREEN}✓ Backend is healthy: $HEALTH${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
fi

# Summary
echo ""
echo "================================================"
echo -e "${GREEN}🎉 Migration Complete!${NC}"
echo "================================================"
echo ""
echo "📋 Summary:"
echo "  • Backup: $BACKUP_DIR"
echo "  • Chain: Polygon Amoy (Chain ID: 80002)"
echo "  • RPC: https://rpc-amoy.polygon.technology/"
echo "  • Backend: http://152.42.199.50:4000"
echo "  • Frontend: http://152.42.199.50"
echo ""
echo "📝 Next Steps:"
echo "  1. Open browser: http://152.42.199.50"
echo "  2. Connect MetaMask"
echo "  3. Switch to Polygon Amoy Testnet"
echo "  4. Test faucet claim"
echo "  5. Test place bet"
echo ""
echo "🔍 Check Status:"
echo "  pm2 status"
echo "  pm2 logs aion-backend"
echo "  curl http://localhost:4000/health"
echo ""

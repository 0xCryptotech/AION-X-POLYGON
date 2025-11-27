#!/bin/bash

echo "=========================================="
echo "Market Cron Service Diagnostics"
echo "=========================================="
echo ""

# Check if PM2 process is running
echo "1. PM2 Process Status:"
pm2 list | grep market-cron
echo ""

# Check recent logs
echo "2. Recent Cron Logs (last 50 lines):"
pm2 logs market-cron --lines 50 --nostream
echo ""

# Check environment variables (without exposing private keys)
echo "3. Environment Check:"
cd /root/Aion-x-main/backend
if [ -f .env ]; then
    echo "✓ .env file exists"
    echo "PROVIDER_URL: $(grep PROVIDER_URL .env | cut -d'=' -f1)"
    echo "CONTRACT_ADDRESS: $(grep CONTRACT_ADDRESS .env | cut -d'=' -f2)"
    echo "OWNER_PRIVATE_KEY: $(grep OWNER_PRIVATE_KEY .env | cut -d'=' -f1) [HIDDEN]"
else
    echo "✗ .env file not found"
fi
echo ""

# Check if ABI file exists
echo "4. Contract ABI Check:"
if [ -f /root/Aion-x-main/backend/abi/PredictionMarket.json ]; then
    echo "✓ PredictionMarket.json exists"
else
    echo "✗ PredictionMarket.json NOT FOUND"
fi
echo ""

# Check database connection
echo "5. Database Check:"
cd /root/Aion-x-main/backend
npx prisma db execute --stdin <<< "SELECT COUNT(*) as open_markets FROM Market WHERE status = 'OPEN';" 2>&1 | tail -5
echo ""

echo "=========================================="
echo "Diagnostics Complete"
echo "=========================================="

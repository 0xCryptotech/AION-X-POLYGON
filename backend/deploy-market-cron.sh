#!/bin/bash

# Deploy Market Cron Service to VPS
# Usage: ./deploy-market-cron.sh

set -e

VPS_HOST="root@103.127.132.109"
VPS_BACKEND_DIR="~/backend"

echo "🚀 Deploying Market Cron Service to VPS..."
echo "================================================"

# Upload marketCronService.js
echo "📤 Uploading marketCronService.js..."
scp marketCronService.js $VPS_HOST:$VPS_BACKEND_DIR/

# Upload updated package.json
echo "📤 Uploading package.json..."
scp package.json $VPS_HOST:$VPS_BACKEND_DIR/

echo ""
echo "✅ Files uploaded successfully!"
echo ""
echo "================================================"
echo "🔧 Setting up service on VPS..."
echo "================================================"

# SSH to VPS and setup
ssh $VPS_HOST << 'ENDSSH'
cd ~/backend

echo "📦 Installing dependencies (if needed)..."
npm install

echo ""
echo "🛑 Stopping existing market-cron service (if running)..."
pm2 stop market-cron 2>/dev/null || echo "No existing service to stop"
pm2 delete market-cron 2>/dev/null || echo "No existing service to delete"

echo ""
echo "🚀 Starting market-cron service with PM2..."
pm2 start marketCronService.js --name market-cron

echo ""
echo "💾 Saving PM2 configuration..."
pm2 save

echo ""
echo "📊 Current PM2 processes:"
pm2 list

echo ""
echo "================================================"
echo "✅ Market Cron Service deployed successfully!"
echo "================================================"
echo ""
echo "📝 Useful commands:"
echo "  - View logs:    pm2 logs market-cron"
echo "  - Stop service: pm2 stop market-cron"
echo "  - Restart:      pm2 restart market-cron"
echo "  - Status:       pm2 status"
echo ""
ENDSSH

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "To view logs from your local machine:"
echo "  ssh $VPS_HOST 'pm2 logs market-cron --lines 50'"

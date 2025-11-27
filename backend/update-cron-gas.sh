#!/bin/bash

echo "=========================================="
echo "Updating Market Cron with Lower Gas Fees"
echo "=========================================="
echo ""

# Upload updated file
echo "📤 Uploading updated marketCronService.js..."
scp marketCronService.js root@152.42.199.50:/root/aion-backend/

# Restart PM2 service
echo ""
echo "🔄 Restarting market-cron service..."
ssh root@152.42.199.50 << 'EOF'
cd /root/aion-backend
pm2 restart market-cron
pm2 save
echo ""
echo "✅ Service restarted!"
echo ""
echo "📊 Checking logs..."
sleep 3
pm2 logs market-cron --lines 20 --nostream
EOF

echo ""
echo "=========================================="
echo "Update Complete!"
echo "=========================================="

#!/bin/bash

echo "=========================================="
echo "Testing Market Cron Setup on VPS"
echo "=========================================="
echo ""

# Upload test script to VPS
echo "📤 Uploading test script to VPS..."
scp test-market-creation.js root@103.127.132.114:/root/Aion-x-main/backend/

# Run the test
echo ""
echo "🧪 Running market creation test..."
echo ""
ssh root@103.127.132.114 << 'EOF'
cd /root/Aion-x-main/backend
node test-market-creation.js
EOF

echo ""
echo "=========================================="
echo "Test Complete"
echo "=========================================="

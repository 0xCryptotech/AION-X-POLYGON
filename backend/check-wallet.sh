#!/bin/bash

echo "Checking wallet configuration on VPS..."
echo ""

ssh root@103.127.132.114 << 'EOF'
cd /root/Aion-x-main/backend

echo "1. Checking .env file location:"
if [ -f .env ]; then
    echo "   ✓ .env exists in backend folder"
else
    echo "   ✗ .env NOT FOUND in backend folder"
fi
echo ""

echo "2. Wallet address from private key:"
node -e "
const { ethers } = require('ethers');
require('dotenv').config();
if (process.env.OWNER_PRIVATE_KEY) {
  const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY);
  console.log('   Address:', wallet.address);
} else {
  console.log('   ✗ OWNER_PRIVATE_KEY not found in .env');
}
"
echo ""

echo "3. Checking balance:"
node -e "
const { ethers } = require('ethers');
require('dotenv').config();
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL || 'https://polygon-rpc.com');
const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
wallet.getBalance().then(b => {
  console.log('   Balance:', ethers.utils.formatEther(b), 'POL');
  if (b.eq(0)) {
    console.log('   ⚠️  WARNING: Wallet has 0 balance!');
  }
}).catch(err => console.log('   ✗ Error:', err.message));
" 2>&1 | head -10

EOF

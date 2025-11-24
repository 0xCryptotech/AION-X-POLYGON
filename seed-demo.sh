#!/bin/bash

echo "🌱 AION-X Demo Data Seeding"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -d "hardhat" ]; then
    echo "❌ Error: Please run this script from the app-main directory"
    exit 1
fi

cd hardhat

echo "📦 Installing dependencies..."
npm install --silent

echo ""
echo "🎲 Creating demo markets and placing bets..."
npx hardhat run scripts/seedDemoData.ts --network bscTestnet

echo ""
echo "✅ Demo data seeding complete!"
echo ""
echo "📊 Summary:"
echo "  - 10 new markets created"
echo "  - 5 demo bets placed"
echo "  - Markets will auto-resolve in 10 minutes"
echo ""
echo "🎯 Next steps:"
echo "  1. Visit https://aion-x.vercel.app/"
echo "  2. Connect your wallet"
echo "  3. Check Portfolio for battle history"
echo "  4. Start a new battle to demo live"
echo ""

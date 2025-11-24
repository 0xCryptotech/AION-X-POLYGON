#!/bin/bash

echo "🚀 AION-X Testnet Deployment Script"
echo "===================================="
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "📦 Building application..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
    echo "✅ Build successful!"
else
    echo "✅ Build folder exists"
fi

echo ""
echo "Choose deployment platform:"
echo "1) Vercel"
echo "2) Netlify"
echo "3) Both"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm i -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm i -g netlify-cli
        fi
        netlify deploy --prod --dir=dist
        ;;
    3)
        echo ""
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            npm i -g vercel
        fi
        vercel --prod
        
        echo ""
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            npm i -g netlify-cli
        fi
        netlify deploy --prod --dir=dist
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Get test MATIC from: https://faucet.polygon.technology/"
echo "2. Add Polygon Amoy Testnet to MetaMask"
echo "3. Test the application"
echo ""
echo "🌐 BSC Testnet Explorer: https://testnet.bscscan.com/"

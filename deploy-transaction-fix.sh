#!/bin/bash

echo "🚀 Deploying Transaction Pending Fix..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found"
    echo "Please run this script from Aion-x-main directory"
    exit 1
fi

echo -e "${BLUE}📦 Building frontend...${NC}"
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Build
echo -e "${BLUE}Building production bundle...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "❌ Build failed"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Check deployment method
echo -e "${BLUE}Select deployment method:${NC}"
echo "1) Vercel (recommended)"
echo "2) VPS manual upload"
echo "3) Skip deployment (build only)"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
        cd ..
        
        # Check if vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}Installing Vercel CLI...${NC}"
            npm install -g vercel
        fi
        
        # Deploy
        vercel --prod
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Deployed to Vercel successfully${NC}"
        else
            echo -e "❌ Vercel deployment failed"
            exit 1
        fi
        ;;
    2)
        echo -e "${YELLOW}📋 Manual VPS deployment instructions:${NC}"
        echo ""
        echo "1. Upload dist folder to VPS:"
        echo "   scp -r dist/* user@your-vps:/var/www/aion-x/"
        echo ""
        echo "2. Or use the upload script:"
        echo "   See PANDUAN_UPLOAD_MANUAL.md for details"
        echo ""
        echo "Build files are ready in: frontend/dist/"
        ;;
    3)
        echo -e "${GREEN}✅ Build completed. Skipping deployment.${NC}"
        echo "Build files are in: frontend/dist/"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Transaction Pending Fix deployed!${NC}"
echo ""
echo -e "${BLUE}What's new:${NC}"
echo "✅ Gas price optimization (20% boost for faster confirmation)"
echo "✅ Real-time transaction progress tracking"
echo "✅ Enhanced error handling and user feedback"
echo "✅ Visual loading states with progress messages"
echo "✅ Transaction hash display for transparency"
echo ""
echo -e "${YELLOW}Testing checklist:${NC}"
echo "1. Connect wallet and ensure you have AION + MATIC"
echo "2. Try placing a bet and observe progress messages"
echo "3. Check that transaction confirms within 30-60 seconds"
echo "4. Verify toast notifications appear correctly"
echo ""
echo "📖 See TRANSACTION_PENDING_FIX.md for full documentation"

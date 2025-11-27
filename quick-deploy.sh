#!/bin/bash

# 🚀 Quick Deploy to Vercel (One Command)
# Usage: ./quick-deploy.sh [commit-message]

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

COMMIT_MSG="${1:-Update frontend}"

echo -e "${BLUE}🚀 Quick Deploy Pipeline${NC}"
echo "================================"
echo ""

# 1. Git commit (if there are changes)
if [[ -n $(git status -s) ]]; then
    echo -e "${BLUE}📝 Committing changes...${NC}"
    git add .
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✅ Changes committed${NC}"
else
    echo -e "${GREEN}✅ No changes to commit${NC}"
fi

# 2. Build and deploy
echo ""
./deploy-to-vercel.sh

echo ""
echo -e "${GREEN}🎉 All done!${NC}"

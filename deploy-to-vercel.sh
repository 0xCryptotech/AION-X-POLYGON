#!/bin/bash

# 🚀 AION-X Vercel Deployment Script
# This script builds locally and deploys to Vercel

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="frontend"
DEPLOY_DIR="/Users/idcuq/Documents/aion-deploy"
BUILD_OUTPUT="dist"

echo -e "${BLUE}🚀 AION-X Vercel Deployment${NC}"
echo "================================"
echo ""

# Step 1: Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Error: frontend directory not found!${NC}"
    exit 1
fi

# Step 2: Check if deploy directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
    echo -e "${YELLOW}⚠️  Deploy directory not found. Creating...${NC}"
    mkdir -p "$DEPLOY_DIR"
fi

# Step 3: Clean previous build
echo -e "${BLUE}🧹 Cleaning previous build...${NC}"
cd "$FRONTEND_DIR"
rm -rf "$BUILD_OUTPUT"

# Step 4: Build frontend
echo -e "${BLUE}🔨 Building frontend...${NC}"
if command -v yarn &> /dev/null; then
    yarn build
else
    npm run build
fi

# Check if build was successful
if [ ! -d "$BUILD_OUTPUT" ]; then
    echo -e "${RED}❌ Build failed! dist directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Step 5: Copy to deploy directory
echo -e "${BLUE}📦 Copying files to deploy directory...${NC}"
cd ..
rm -rf "$DEPLOY_DIR"/*
cp -r "$FRONTEND_DIR/$BUILD_OUTPUT"/* "$DEPLOY_DIR/"

echo -e "${GREEN}✅ Files copied!${NC}"
echo ""

# Step 6: Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
cd "$DEPLOY_DIR"

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found!${NC}"
    echo -e "${YELLOW}Install with: npm i -g vercel${NC}"
    exit 1
fi

# Deploy
vercel --prod

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${BLUE}🌐 Check your deployment at: https://vercel.com/dashboard${NC}"

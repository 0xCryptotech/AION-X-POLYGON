# 🚀 AION-X Vercel Deployment Guide

## 📋 Overview

Karena Vercel tidak bisa build langsung dari source (dependency issues), kita menggunakan **local build + manual deploy** workflow.

## 🎯 Deployment Workflow

```
Local Machine                    Vercel
─────────────                    ──────
1. Build frontend  ──────────>  
2. Copy to deploy dir ───────>  
3. Deploy static files ──────>  4. Serve to users
```

## 🛠️ Setup (One Time)

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Create Deploy Directory

```bash
mkdir -p /Users/idcuq/Documents/aion-deploy
```

### 4. Initialize Vercel Project (in deploy directory)

```bash
cd /Users/idcuq/Documents/aion-deploy
vercel
# Follow prompts:
# - Link to existing project? Yes
# - Select your project: AION-X-POLYGON
```

## 🚀 Deployment Methods

### Method 1: Automated Script (Recommended)

```bash
cd Aion-x-main
./deploy-to-vercel.sh
```

**What it does:**
1. ✅ Cleans previous build
2. ✅ Builds frontend (yarn build)
3. ✅ Copies dist to deploy directory
4. ✅ Deploys to Vercel production

### Method 2: Quick Deploy (with Git commit)

```bash
cd Aion-x-main
./quick-deploy.sh "Your commit message"
```

**What it does:**
1. ✅ Git commit changes
2. ✅ Runs deploy-to-vercel.sh
3. ✅ One command deployment!

### Method 3: Manual (Original Way)

```bash
# 1. Build
cd Aion-x-main/frontend
yarn build

# 2. Copy
cp -r dist/* /Users/idcuq/Documents/aion-deploy/

# 3. Deploy
cd /Users/idcuq/Documents/aion-deploy
vercel --prod
```

## 📝 Environment Variables

Make sure these are set in Vercel dashboard:

```
VITE_CONTRACT_ADDRESS=0x2C3B12e01313A8336179c5c850d64335137FAbab
VITE_TOKEN_ADDRESS=0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
VITE_STAKING_ADDRESS=0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5
VITE_FAUCET_ADDRESS=0x765622d95D072c00209Cd87e60EfCf472bDF423D
VITE_BACKEND_URL=https://api.aion-x.xyz
VITE_CHAIN_ID=80002
VITE_RPC_URL=https://rpc-amoy.polygon.technology/
VITE_FALLBACK_RPC=https://polygon-amoy.g.alchemy.com/v2/demo
```

**Note:** Environment variables are baked into build, so they're set in `.env.local` before building.

## 🔍 Troubleshooting

### Build Fails Locally

**Check:**
```bash
cd frontend
yarn install  # or npm install
yarn build    # or npm run build
```

**Common issues:**
- Missing dependencies → `yarn install`
- Node version → Use Node 16+
- Memory issues → `export NODE_OPTIONS=--max-old-space-size=4096`

### Deploy Fails

**Check:**
```bash
# Verify Vercel CLI
vercel --version

# Re-login
vercel logout
vercel login

# Check deploy directory
ls -la /Users/idcuq/Documents/aion-deploy
```

### Files Not Updating

**Solution:**
```bash
# Clear deploy directory
rm -rf /Users/idcuq/Documents/aion-deploy/*

# Rebuild and redeploy
./deploy-to-vercel.sh
```

## 📊 Deployment Checklist

Before deploying:

- [ ] All changes committed to Git
- [ ] Local build successful (`yarn build`)
- [ ] Environment variables correct in `.env.local`
- [ ] Test locally (`yarn dev`)
- [ ] No console errors
- [ ] Wallet connection works
- [ ] Contract addresses correct

After deploying:

- [ ] Visit Vercel URL
- [ ] Test all pages
- [ ] Test wallet connection
- [ ] Test contract interactions
- [ ] Check console for errors
- [ ] Test on mobile

## 🎯 Why This Approach?

### ❌ Problems with Direct Vercel Build:
- Dependency conflicts
- Build timeout
- Memory issues
- Complex monorepo structure
- CRACO/Vite confusion

### ✅ Benefits of Local Build:
- Full control over build process
- Faster deployment (no build time on Vercel)
- Easier debugging
- Consistent builds
- No Vercel build limits

## 📈 Optimization Tips

### 1. Build Performance

```bash
# Use yarn (faster than npm)
yarn build

# Or with cache
yarn build --cache
```

### 2. Deploy Only Changed Files

Vercel automatically handles this, but you can verify:

```bash
vercel --prod --debug
```

### 3. Preview Deployments

For testing before production:

```bash
cd /Users/idcuq/Documents/aion-deploy
vercel  # without --prod flag
```

## 🔄 CI/CD Alternative (Future)

If you want to automate this with GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && yarn install
      - run: cd frontend && yarn build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: frontend/dist
```

## 📞 Support

**Vercel Dashboard:** https://vercel.com/dashboard  
**Vercel Docs:** https://vercel.com/docs  
**Vercel CLI Docs:** https://vercel.com/docs/cli

## 🎉 Quick Reference

```bash
# Deploy (automated)
./deploy-to-vercel.sh

# Deploy with commit
./quick-deploy.sh "Update message"

# Manual deploy
cd frontend && yarn build
cp -r dist/* /Users/idcuq/Documents/aion-deploy/
cd /Users/idcuq/Documents/aion-deploy && vercel --prod

# Check deployment
vercel ls

# View logs
vercel logs
```

---

**Last Updated:** November 27, 2024  
**Status:** ✅ Working  
**Deployment URL:** https://aion-x-polygon.vercel.app

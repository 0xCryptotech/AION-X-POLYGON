# 🚀 AION-X Testnet Deployment

## ✅ Pre-Deployment Checklist

- [x] Build successful (567.89 kB)
- [x] BSC Testnet configured (Chain ID: 0x61)
- [x] All features implemented
- [x] Wallet integration ready
- [x] Battle history system ready
- [x] Notification system ready
- [x] Achievement system ready

---

## 🎯 Quick Deploy (Recommended)

### Option 1: Automated Script

```bash
cd /Users/idcuq/Documents/DORAHACKS/app-main/frontend
./deploy.sh
```

Choose your platform:
1. Vercel (Recommended)
2. Netlify
3. Both

---

## 🚀 Manual Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Your app will be live at:** `https://aion-x-[random].vercel.app`

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Your app will be live at:** `https://aion-x-[random].netlify.app`

---

## 🌐 BSC Testnet Setup

### 1. Add BSC Testnet to MetaMask

**Automatic (Easiest):**
- Visit: https://chainlist.org
- Search: "BSC Testnet"
- Click: "Add to MetaMask"

**Manual:**
- Network Name: `BNB Smart Chain Testnet`
- RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545/`
- Chain ID: `97`
- Currency: `tBNB`
- Explorer: `https://testnet.bscscan.com/`

### 2. Get Test BNB

**Faucets:**
1. https://testnet.bnbchain.org/faucet-smart
2. https://testnet.binance.org/faucet-smart

**Steps:**
1. Connect MetaMask
2. Switch to BSC Testnet
3. Copy your address
4. Request tBNB from faucet
5. Wait 1-2 minutes

---

## 📋 Post-Deployment Testing

### Test Checklist:

#### 1. Wallet Connection ✅
```
□ Open deployed app
□ Click "Connect Wallet"
□ Select MetaMask
□ Approve connection
□ App switches to BSC Testnet
□ tBNB balance displays
□ Disconnect works
```

#### 2. Battle Features ✅
```
□ Navigate to Battle page
□ Open AI vs AI modal
□ Select AI models from dropdowns
□ Choose asset (BTC/ETH/SOL)
□ Select timeframe
□ Set stake amount
□ Start battle
□ Battle completes successfully
```

#### 3. History & Stats ✅
```
□ Navigate to History page
□ Battle appears in history
□ Statistics update correctly
□ Filters work (Win/Loss/Draw)
□ Battle type filters work
□ Timestamps display correctly
```

#### 4. Achievements ✅
```
□ Navigate to Achievements page
□ All 13 achievements visible
□ Progress bars display
□ Locked/unlocked states correct
□ Completion percentage shows
```

#### 5. Notifications ✅
```
□ Toast notifications appear
□ Battle result notifications work
□ Achievement unlock notifications work
□ Wallet connection notifications work
```

---

## 🔧 Configuration Files

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### .env.production
```env
VITE_NETWORK=testnet
VITE_CHAIN_ID=0x61
VITE_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
```

---

## 📊 Build Output

```
dist/index.html                   0.65 kB
dist/assets/index-CnAcYa_J.css   82.89 kB
dist/assets/index-D6OZZrnh.js   567.89 kB
✓ built in 1.99s
```

---

## 🔗 Important Links

**Testnet Resources:**
- Faucet: https://testnet.bnbchain.org/faucet-smart
- Explorer: https://testnet.bscscan.com/
- ChainList: https://chainlist.org/?search=bsc+testnet

**Deployment Platforms:**
- Vercel: https://vercel.com
- Netlify: https://netlify.com

**Documentation:**
- BSC Docs: https://docs.bnbchain.org
- MetaMask: https://docs.metamask.io

---

## 🐛 Troubleshooting

### Issue: Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Issue: Can't connect wallet
```bash
# Check MetaMask is installed
# Check you're on BSC Testnet
# Clear browser cache
# Try incognito mode
```

### Issue: No test BNB
```bash
# Use faucet: https://testnet.bnbchain.org/faucet-smart
# Wait 1-2 minutes
# Check balance on: https://testnet.bscscan.com/
```

### Issue: Deployment fails
```bash
# Vercel
vercel --debug

# Netlify
netlify deploy --debug
```

---

## 🎯 Custom Domain (Optional)

### Vercel:
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records

### Netlify:
1. Go to site settings
2. Click "Domain management"
3. Add custom domain
4. Update DNS records

---

## 🔄 Update Deployment

### Vercel:
```bash
# Just push to git or run
vercel --prod
```

### Netlify:
```bash
netlify deploy --prod --dir=dist
```

---

## 📈 Monitor Deployment

### Vercel Dashboard:
- https://vercel.com/dashboard
- View deployments
- Check analytics
- Monitor performance

### Netlify Dashboard:
- https://app.netlify.com
- View deploys
- Check analytics
- Monitor bandwidth

---

## 🎉 Success!

Your AION-X app is now live on BSC Testnet!

**Next Steps:**
1. ✅ Test all features thoroughly
2. ✅ Get feedback from users
3. ✅ Fix any bugs found
4. ✅ Prepare for mainnet launch

---

## 🚀 Ready for Mainnet?

When ready to deploy to mainnet:

1. Update `WalletContext.jsx`:
```javascript
const BNB_CHAIN_ID = '0x38'; // BSC Mainnet
```

2. Update RPC URLs:
```javascript
rpcUrls: ['https://bsc-dataseed.binance.org/']
blockExplorerUrls: ['https://bscscan.com/']
```

3. Rebuild and redeploy:
```bash
npm run build
vercel --prod
```

---

**AION-X is ready to conquer BSC Testnet!** 🚀🎮

Built with ❤️ on BNB Chain

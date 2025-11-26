# AION-X Testnet Deployment Guide

## 🌐 BSC Testnet Configuration

**Network Details:**
- Chain ID: `0x61` (97 in decimal)
- Network Name: BNB Smart Chain Testnet
- RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545/`
- Block Explorer: `https://testnet.bscscan.com/`
- Currency: tBNB (Test BNB)

---

## 💰 Get Test BNB

### Faucet Links:
1. **Official BSC Faucet**: https://testnet.bnbchain.org/faucet-smart
2. **Alternative Faucet**: https://testnet.binance.org/faucet-smart

**Steps:**
1. Connect your MetaMask wallet
2. Switch to BSC Testnet
3. Copy your wallet address
4. Paste in faucet and request tBNB
5. Wait 1-2 minutes for tokens to arrive

---

## 🚀 Deploy to Vercel

### Quick Deploy:

```bash
cd /Users/idcuq/Documents/DORAHACKS/app-main/frontend

# Build for production
npm run build

# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Steps:

1. **Login to Vercel:**
```bash
vercel login
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Follow prompts:**
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? aion-x
   - Directory? ./
   - Override settings? No

4. **Done!** Your app will be live at: `https://aion-x.vercel.app`

---

## 🚀 Deploy to Netlify

### Quick Deploy:

```bash
# Build for production
npm run build

# Install Netlify CLI (if not installed)
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Drag & Drop Deploy:

1. Go to https://app.netlify.com/drop
2. Drag the `dist` folder
3. Done!

---

## 🔧 Environment Variables

If using environment variables, add to your deployment platform:

**Vercel:**
```bash
vercel env add VITE_NETWORK production
# Enter: testnet

vercel env add VITE_CHAIN_ID production
# Enter: 0x61
```

**Netlify:**
```bash
netlify env:set VITE_NETWORK testnet
netlify env:set VITE_CHAIN_ID 0x61
```

---

## ✅ Testing Checklist

After deployment, test:

### 1. Wallet Connection
- [ ] Connect MetaMask
- [ ] Auto-switch to BSC Testnet
- [ ] Display tBNB balance
- [ ] Disconnect wallet

### 2. Battle Features
- [ ] Open AI vs AI modal
- [ ] Select AI models
- [ ] Start battle
- [ ] Check battle completes

### 3. History & Stats
- [ ] View battle history
- [ ] Check statistics update
- [ ] Test filters

### 4. Achievements
- [ ] View achievements page
- [ ] Check progress tracking
- [ ] Verify unlock notifications

### 5. Notifications
- [ ] Toast notifications appear
- [ ] Notifications are readable
- [ ] Auto-dismiss works

---

## 🔗 Useful Links

**BSC Testnet:**
- Faucet: https://testnet.bnbchain.org/faucet-smart
- Explorer: https://testnet.bscscan.com/
- RPC: https://data-seed-prebsc-1-s1.binance.org:8545/

**Deployment Platforms:**
- Vercel: https://vercel.com
- Netlify: https://netlify.com
- Fleek: https://fleek.co (for IPFS)

**MetaMask:**
- Add BSC Testnet: https://chainlist.org/?search=bsc+testnet

---

## 📱 Add BSC Testnet to MetaMask

### Automatic (Recommended):
1. Go to https://chainlist.org
2. Search "BSC Testnet"
3. Click "Add to MetaMask"

### Manual:
1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter details:
   - Network Name: `BNB Smart Chain Testnet`
   - RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545/`
   - Chain ID: `97`
   - Currency Symbol: `tBNB`
   - Block Explorer: `https://testnet.bscscan.com/`

---

## 🐛 Troubleshooting

### Issue: Can't connect to testnet
**Solution:** 
- Clear MetaMask cache
- Re-add BSC Testnet network
- Refresh page

### Issue: No tBNB in wallet
**Solution:**
- Use faucet to get test tokens
- Wait 1-2 minutes
- Check on testnet.bscscan.com

### Issue: Transactions failing
**Solution:**
- Ensure you have enough tBNB for gas
- Check network is BSC Testnet (Chain ID: 97)
- Try increasing gas limit

---

## 🎯 Next Steps

After testnet deployment:

1. **Test thoroughly** with test BNB
2. **Fix any bugs** found during testing
3. **Get user feedback** from beta testers
4. **Deploy to mainnet** when ready
5. **Switch to real BNB** (Chain ID: 0x38)

---

## 🔄 Switch to Mainnet Later

When ready for mainnet, update `WalletContext.jsx`:

```javascript
const BNB_CHAIN_ID = '0x38'; // BSC Mainnet
```

And update RPC URLs:
```javascript
rpcUrls: ['https://bsc-dataseed.binance.org/']
blockExplorerUrls: ['https://bscscan.com/']
```

---

## 📞 Support

Need help?
- BSC Docs: https://docs.bnbchain.org
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

---

**Ready to deploy AION-X to BSC Testnet!** 🚀

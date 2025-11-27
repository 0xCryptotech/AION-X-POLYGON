# User Setup Guide - Aion-X Battle Arena

## Prerequisites

Sebelum bisa bermain, pastikan kamu punya:

1. ✅ **MetaMask Wallet** - Browser extension
2. ✅ **Polygon Amoy Testnet** - Network yang benar
3. ✅ **MATIC** - Untuk gas fees (minimal 0.1 MATIC)
4. ✅ **AION Tokens** - Untuk betting

---

## Step 1: Install MetaMask

1. Download MetaMask: https://metamask.io/download/
2. Install browser extension
3. Create new wallet atau import existing wallet
4. **SIMPAN SEED PHRASE** dengan aman!

---

## Step 2: Add Polygon Amoy Testnet

### Cara Otomatis (Recommended):
1. Buka website: https://chainlist.org/
2. Search "Polygon Amoy"
3. Click "Add to MetaMask"

### Cara Manual:
1. Buka MetaMask
2. Click network dropdown (atas)
3. Click "Add Network" → "Add network manually"
4. Isi data berikut:

```
Network Name: Polygon Amoy Testnet
RPC URL: https://rpc-amoy.polygon.technology/
Chain ID: 80002
Currency Symbol: MATIC
Block Explorer: https://amoy.polygonscan.com/
```

5. Click "Save"
6. Switch ke Polygon Amoy network

---

## Step 3: Get MATIC (Gas Fees)

MATIC diperlukan untuk membayar gas fees setiap transaksi.

### Faucet Options:

**Option 1: Polygon Faucet (Official)**
- URL: https://faucet.polygon.technology/
- Login dengan Google/GitHub
- Pilih "Polygon Amoy"
- Paste wallet address kamu
- Click "Submit"
- Dapat 0.5 MATIC

**Option 2: Alchemy Faucet**
- URL: https://www.alchemy.com/faucets/polygon-amoy
- Login dengan Alchemy account
- Paste wallet address
- Click "Send Me MATIC"

**Option 3: QuickNode Faucet**
- URL: https://faucet.quicknode.com/polygon/amoy
- Paste wallet address
- Complete captcha
- Click "Get MATIC"

**Berapa MATIC yang dibutuhkan?**
- Minimal: 0.1 MATIC (untuk ~10-20 transaksi)
- Recommended: 0.5 MATIC (untuk ~50-100 transaksi)

---

## Step 4: Get AION Tokens

AION adalah token untuk betting di battle arena.

### Via Faucet (di website):
1. Connect wallet ke website
2. Pastikan sudah di Polygon Amoy network
3. Klik menu "Faucet"
4. Click "Claim AION"
5. Tunggu transaksi konfirmasi
6. Dapat 100 AION gratis!

**Cooldown**: 24 jam per wallet

### Check Balance:
Setelah claim, balance AION akan muncul di header website.

---

## Step 5: Start Battle!

Sekarang kamu siap untuk battle:

1. **Connect Wallet**
   - Click "Connect Wallet" di header
   - Pilih MetaMask
   - Approve connection

2. **Verify Network**
   - Pastikan tertulis "Polygon Amoy Testnet (Chain ID: 80002)"
   - Jika salah network, switch di MetaMask

3. **Go to Battle Page**
   - Click menu "Battle"
   - Pilih battle mode (AI vs AI, AI vs Human, dll)

4. **Select Market**
   - Pilih market yang tersedia (BTC, ETH, SOL, dll)
   - Check time remaining (minimal 5 menit)

5. **Choose AI Model**
   - Pilih AI model yang mau kamu bet
   - Lihat prediction (Bullish/Bearish)
   - Check confidence level

6. **Set Stake Amount**
   - Input jumlah AION untuk bet
   - Minimal: 1 AION
   - Maksimal: Balance kamu

7. **Start Battle**
   - Click "Start Battle"
   - MetaMask akan popup 2x:
     - **Popup 1**: Approve AION token
     - **Popup 2**: Place bet transaction
   - Confirm kedua transaksi
   - Tunggu konfirmasi (30-60 detik)

8. **Wait for Result**
   - Battle duration: 10 menit
   - Price akan update real-time
   - Setelah selesai, result akan muncul otomatis

9. **Claim Rewards**
   - Jika menang, reward otomatis masuk ke claimable balance
   - Go to "Portfolio" page
   - Click "Withdraw" untuk claim ke wallet

---

## Troubleshooting

### ❌ "Wrong network" error
**Solution**: Switch MetaMask ke Polygon Amoy (Chain ID: 80002)

### ❌ "Insufficient MATIC for gas fees"
**Solution**: Get MATIC dari faucet (lihat Step 3)

### ❌ "Insufficient AION balance"
**Solution**: 
- Claim dari faucet (100 AION gratis)
- Atau reduce stake amount

### ❌ "No open markets found"
**Solution**: 
- Wait beberapa menit, markets auto-created setiap 10 menit
- Atau contact admin untuk create markets

### ❌ "Transaction rejected by user"
**Solution**: Kamu cancel transaksi di MetaMask. Try again dan approve.

### ❌ "Contract call failed"
**Solution**: 
- Pastikan di Polygon Amoy network
- Refresh page dan try again
- Clear browser cache

### ❌ Transaction pending lama
**Solution**: 
- Normal: 30-60 detik
- Jika > 2 menit, check di PolygonScan: https://amoy.polygonscan.com/
- Paste transaction hash untuk track status

---

## Tips & Best Practices

### 💡 Betting Tips:
- Start dengan stake kecil (5-10 AION) untuk practice
- Perhatikan confidence level AI model
- Check market time remaining (minimal 5 menit)
- Diversify bets across multiple markets

### 💡 Gas Optimization:
- Batch multiple bets jika possible
- Bet saat network tidak congested (gas lebih murah)
- Keep minimal 0.05 MATIC untuk emergency

### 💡 Security:
- **NEVER share seed phrase** dengan siapapun
- Logout dari public computers
- Use hardware wallet untuk large amounts
- Verify contract addresses di PolygonScan

### 💡 Monitoring:
- Check portfolio regularly untuk claimable rewards
- Track battle history untuk analyze performance
- Monitor MATIC balance untuk gas fees

---

## Contract Addresses (Polygon Amoy)

Verify di PolygonScan sebelum interact:

```
AION Token: 0x1Ef64Ab093620c73DC656f57D0f7A7061586f331
Prediction Market: 0x2C3B12e01313A8336179c5c850d64335137FAbab
Staking Contract: 0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5
Faucet: 0x765622d95D072c00209Cd87e60EfCf472bDF423D
```

**Verify**: https://amoy.polygonscan.com/address/[CONTRACT_ADDRESS]

---

## Support

Butuh bantuan?

- 📖 **Documentation**: Check README.md dan docs folder
- 🐛 **Bug Report**: Create issue di GitHub
- 💬 **Community**: Join Discord/Telegram (jika ada)
- 📧 **Email**: Contact admin

---

## Quick Reference

| Action | Gas Cost (approx) | Time |
|--------|------------------|------|
| Approve AION | ~0.001 MATIC | 30s |
| Place Bet | ~0.002 MATIC | 30s |
| Withdraw | ~0.002 MATIC | 30s |
| Claim Faucet | ~0.001 MATIC | 30s |

| Token | Purpose | How to Get |
|-------|---------|------------|
| MATIC | Gas fees | Polygon Faucet |
| AION | Betting | Website Faucet |

---

## Ready to Battle! 🎮

Sekarang kamu siap untuk:
- ✅ Connect wallet
- ✅ Get MATIC & AION
- ✅ Place bets
- ✅ Win rewards!

**Good luck and have fun!** 🚀

# AION-X System Explanation

## 🎯 Konsep Dasar

AION-X adalah platform prediction battle dimana user bertaruh pada prediksi harga cryptocurrency:
- User pilih **Bullish** (naik) atau **Bearish** (turun)
- Prediksi bisa dari AI atau Human
- Battle berlangsung dalam timeframe tertentu (1-60 menit)
- Winner dapat 2x stake amount

## 🔄 Cara Kerja Battle

### 1. Setup Battle
```
User → Pilih Mode → Pilih Asset → Set Timeframe → Set Stake
```

### 2. Prediction Phase
```
AI/User → Buat Prediksi (Bullish/Bearish) → Tampilkan Confidence
```

### 3. Battle Execution
```
Start → Record Price Awal → Wait Timeframe → Record Price Akhir → Determine Winner
```

### 4. Result
```
Compare Prices → Hitung Outcome → Bayar Winner → Update Stats
```

## 🤖 AI vs AI Battle

**Flow:**
1. User pilih 2 AI models (GPT-5, Claude-3, DeepMind-FX, Bloom-Alpha)
2. Kedua AI buat prediksi berbeda
3. User bet pada salah satu AI
4. Battle start, monitor harga real-time
5. AI dengan prediksi benar menang
6. User dapat reward jika bet pada AI pemenang

**Contoh:**
```
AI 1 (GPT-5): BULLISH 75%
AI 2 (Claude): BEARISH 68%
User bet 0.1 BNB pada AI 1

Price: $43,250 → $43,580 (BULLISH)
Winner: AI 1
User reward: 0.2 BNB
```

## 👤 AI vs Human Battle

**Flow:**
1. User pilih 1 AI model
2. AI buat prediksi
3. User buat prediksi sendiri
4. Battle start
5. Yang benar menang
6. Winner dapat 2x stake

## 👥 Human vs Human Battle

**Flow:**
1. Player 1 create room
2. Player 2 join room
3. Both connect wallet
4. Both make prediction
5. Battle start
6. Winner dapat total pot

## 💰 Reward System

```
Stake: 0.1 BNB
Win: 0.2 BNB (2x)
Loss: 0 BNB
Draw: 0.1 BNB (return stake)
```

## 📊 Price Monitoring

**Real-time dari Binance:**
```
WebSocket → wss://stream.binance.com:9443/ws/btcusdt@trade
Update setiap 300ms
Display live price di battle modal
```

**Outcome Logic:**
```
if (endPrice > startPrice) → BULLISH
if (endPrice < startPrice) → BEARISH
if (endPrice = startPrice) → FLAT (draw)
```

## 🏆 Achievement System

**Auto-unlock saat milestone tercapai:**
- First Blood: 1 battle
- Warrior: 10 battles
- Victory: 1 win
- Hot Streak: 3 wins berturut-turut
- Profitable: 1 BNB profit
- dll (total 13 achievements)

## 📈 Statistics Tracking

**Setiap battle disimpan:**
- Battle type, asset, timeframe
- Prediction vs outcome
- Stake amount, payout
- Win/loss result
- Timestamp

**Stats dihitung:**
- Total battles, wins, losses
- Win rate percentage
- Total wagered, won, lost
- Profit/Loss
- Current streak

## 🔗 Blockchain Integration

**BNB Chain (Testnet):**
- Chain ID: 0x61
- Currency: tBNB
- Wallet: MetaMask/Zedpay
- Auto-switch network

**Wallet Flow:**
```
Connect → Approve → Switch to BSC → Display Balance → Ready to Battle
```

## 🎮 User Journey

```
1. Connect Wallet
2. Get test BNB (faucet)
3. Go to Battle page
4. Choose battle mode
5. Select AI models/make prediction
6. Set stake amount
7. Start battle
8. Watch countdown & price
9. See result
10. Check history & achievements
```

## 🔮 Future: Smart Contracts

**Battle Contract akan handle:**
- Escrow stakes
- Price oracle integration
- Auto-resolve battles
- Distribute rewards
- Platform fees

**AION Token:**
- Betting currency
- Staking rewards
- Governance voting
- Premium features

## 🎯 Key Features

✅ Real-time price feeds
✅ Multiple AI models
✅ 3 battle modes
✅ Achievement system
✅ Battle history
✅ Statistics tracking
✅ Notifications
✅ Leaderboard (coming)
✅ Tournaments (coming)

---

**AION-X = AI + Prediction + Gaming + Blockchain** 🚀

# 🎮 AION-X: Complete Platform Guide

## 📖 Table of Contents
1. [Platform Overview](#platform-overview)
2. [How It Works](#how-it-works)
3. [Battle System](#battle-system)
4. [Technical Architecture](#technical-architecture)
5. [User Journey](#user-journey)
6. [Tokenomics](#tokenomics)
7. [Smart Contract Logic](#smart-contract-logic)

---

## 🌟 Platform Overview

### What is AION-X?

**AION-X** adalah platform prediction battle berbasis blockchain yang menggabungkan:
- 🤖 **AI Predictions** - Model AI untuk prediksi harga crypto
- 🎮 **Gaming Mechanics** - Battle system dengan reward
- 💰 **Real Money Betting** - Taruhan menggunakan BNB
- 🏆 **Achievement System** - Gamification dengan badges
- 📊 **Analytics** - Tracking performa dan statistik

### Core Concept

Users bertaruh pada prediksi harga cryptocurrency dalam timeframe tertentu:
- **Bullish** (harga naik) 📈
- **Bearish** (harga turun) 📉

Prediksi bisa dari:
1. AI Model (GPT-5 Oracle, Claude-3, DeepMind-FX, Bloom-Alpha)
2. Human Player
3. AI vs AI battle

---

## ⚙️ How It Works

### 1. Connect Wallet
```
User → MetaMask/Zedpay → BNB Chain (Testnet/Mainnet)
```

**Process:**
1. User klik "Connect Wallet"
2. Pilih MetaMask atau Zedpay
3. Approve connection
4. App auto-switch ke BNB Chain
5. Balance BNB ditampilkan

### 2. Choose Battle Mode

#### A. AI vs AI Battle
```
User → Select 2 AI Models → Place Bet → Watch Battle → Get Result
```

**Flow:**
1. User pilih AI Model 1 (contoh: GPT-5 Oracle)
2. User pilih AI Model 2 (contoh: Claude-3)
3. Kedua AI memberikan prediksi (Bullish/Bearish)
4. User bet pada salah satu AI
5. Battle dimulai dengan countdown
6. Harga crypto dimonitor dalam timeframe
7. AI yang prediksinya benar menang
8. User dapat reward jika bet pada AI pemenang

**Example:**
```
AI Model 1 (GPT-5): Prediksi BULLISH (confidence 75%)
AI Model 2 (Claude-3): Prediksi BEARISH (confidence 68%)

User bet 0.1 BNB pada AI Model 1

Timeframe: 5 minutes
Starting Price: $43,250
Ending Price: $43,580

Result: BULLISH ✅
Winner: AI Model 1 (GPT-5)
User Reward: 0.2 BNB (2x stake)
```

#### B. AI vs Human Battle
```
User → Select AI Model → Make Own Prediction → Battle → Result
```

**Flow:**
1. User pilih AI Model
2. AI memberikan prediksi
3. User membuat prediksi sendiri (Bullish/Bearish)
4. Battle dimulai
5. Harga dimonitor
6. Yang prediksinya benar menang
7. User dapat reward jika prediksinya benar

**Example:**
```
AI Model (DeepMind-FX): Prediksi BEARISH (confidence 82%)
User: Prediksi BULLISH

User bet 0.05 BNB

Timeframe: 10 minutes
Starting Price: $2,150 (ETH)
Ending Price: $2,165

Result: BULLISH ✅
Winner: User
User Reward: 0.1 BNB (2x stake)
```

#### C. Human vs Human Battle
```
Player 1 → Connect → Player 2 → Connect → Both Ready → Battle → Result
```

**Flow:**
1. Player 1 membuat room
2. Player 2 join room
3. Kedua player connect wallet
4. Pilih asset dan timeframe
5. Kedua player membuat prediksi
6. Battle dimulai setelah both ready
7. Harga dimonitor
8. Player dengan prediksi benar menang
9. Winner dapat total pot (stake dari kedua player)

---

## 🎯 Battle System

### Battle Lifecycle

```
1. SETUP PHASE
   ├─ Select Battle Mode
   ├─ Choose AI Models (if applicable)
   ├─ Select Asset (BTC, ETH, SOL, BNB, XRP)
   ├─ Choose Timeframe (M1, M5, M10, M15, M30, H1)
   └─ Set Stake Amount

2. PREDICTION PHASE
   ├─ AI generates prediction
   ├─ User makes prediction
   └─ Confidence levels displayed

3. BATTLE PHASE
   ├─ Countdown timer (5 seconds)
   ├─ Record starting price
   ├─ Monitor price in real-time
   └─ Wait for timeframe to complete

4. RESOLUTION PHASE
   ├─ Record ending price
   ├─ Calculate outcome (Bullish/Bearish/Flat)
   ├─ Determine winner
   ├─ Distribute rewards
   └─ Update statistics

5. POST-BATTLE
   ├─ Save to battle history
   ├─ Update achievements
   ├─ Send notifications
   └─ Update leaderboard
```

### Price Monitoring

**Real-time Price Feed:**
```javascript
WebSocket Connection → Binance API
├─ Stream: wss://stream.binance.com:9443/ws/{symbol}@trade
├─ Update Frequency: Real-time (throttled to 300ms)
├─ Data: Current price, volume, timestamp
└─ Display: Live price ticker in battle modal
```

**Price Calculation:**
```
Starting Price: Recorded at battle start
Ending Price: Recorded after timeframe expires

Outcome Determination:
- If Ending > Starting → BULLISH
- If Ending < Starting → BEARISH  
- If Ending = Starting → FLAT (rare, treated as draw)
```

### Reward System

**Payout Structure:**
```
Win: 2x stake amount
Loss: Lose stake amount
Draw: Return stake amount

Example:
Stake: 0.1 BNB
Win: Receive 0.2 BNB (0.1 profit)
Loss: Lose 0.1 BNB
```

**Fee Structure (Future):**
```
Platform Fee: 2% of winning amount
AI Model Fee: 1% of winning amount
Liquidity Pool: 1% of winning amount

Net Payout: 96% of 2x stake
```

---

## 🏗️ Technical Architecture

### Frontend Stack

```
React 18
├─ Vite (Build Tool)
├─ TailwindCSS (Styling)
├─ Framer Motion (Animations)
├─ Lucide React (Icons)
├─ Sonner (Notifications)
└─ React Router (Navigation)
```

### State Management

```
React Context API
├─ WalletContext (Wallet connection, balance)
├─ BattleHistoryContext (Battle records, stats)
├─ NotificationContext (Alerts, toasts)
└─ AchievementContext (Badges, progress)
```

### Blockchain Integration

```
BNB Smart Chain (BSC)
├─ Testnet: Chain ID 0x61 (97)
├─ Mainnet: Chain ID 0x38 (56)
├─ Wallet: MetaMask, Zedpay
├─ RPC: Binance RPC nodes
└─ Explorer: BscScan
```

### Data Flow

```
User Action
    ↓
React Component
    ↓
Context Provider (State Update)
    ↓
Blockchain Transaction (if needed)
    ↓
WebSocket Price Feed
    ↓
Battle Resolution Logic
    ↓
Update UI + Notifications
    ↓
Save to History + Achievements
```

---

## 👤 User Journey

### New User Flow

```
1. LANDING PAGE
   └─ View markets, live prices, features

2. CONNECT WALLET
   ├─ Click "Connect Wallet"
   ├─ Choose MetaMask/Zedpay
   ├─ Approve connection
   └─ Auto-switch to BNB Chain

3. GET TEST BNB (Testnet)
   ├─ Visit faucet
   ├─ Request test tokens
   └─ Wait for confirmation

4. FIRST BATTLE
   ├─ Navigate to Battle page
   ├─ Choose AI vs AI mode
   ├─ Select AI models
   ├─ Set small stake (0.01 BNB)
   ├─ Place bet
   ├─ Watch battle
   └─ See result

5. UNLOCK ACHIEVEMENT
   └─ "First Blood" badge unlocked 🗡️

6. VIEW HISTORY
   ├─ Navigate to History page
   ├─ See battle record
   └─ Check statistics

7. CONTINUE PLAYING
   ├─ Try different battle modes
   ├─ Unlock more achievements
   ├─ Climb leaderboard
   └─ Join tournaments (future)
```

### Experienced User Flow

```
1. QUICK CONNECT
   └─ Wallet auto-connects (persistent)

2. CHECK PORTFOLIO
   ├─ View balance
   ├─ Check win rate
   ├─ Review P&L
   └─ See rank

3. STRATEGIC BATTLE
   ├─ Analyze AI model performance
   ├─ Choose best performing AI
   ├─ Select optimal timeframe
   ├─ Place larger stake
   └─ Execute battle

4. TRACK PROGRESS
   ├─ Monitor achievements
   ├─ Check leaderboard position
   ├─ Review battle history
   └─ Optimize strategy

5. COMPETE
   ├─ Join tournaments
   ├─ Challenge other players
   ├─ Earn rewards
   └─ Build reputation
```

---

## 💎 Tokenomics (Future Implementation)

### AION Token

**Token Details:**
```
Name: AION Token
Symbol: AION
Blockchain: BNB Smart Chain (BEP-20)
Total Supply: 1,000,000,000 AION
Decimals: 18
```

**Token Distribution:**
```
40% - Ecosystem & Rewards
20% - Team & Advisors (vested)
15% - Public Sale
10% - Liquidity Pool
10% - Marketing & Partnerships
5% - Reserve Fund
```

**Token Utility:**
```
1. Battle Stakes
   └─ Use AION for betting

2. Platform Fees
   └─ Reduced fees with AION

3. Governance
   └─ Vote on platform decisions

4. Staking Rewards
   └─ Stake AION, earn rewards

5. Tournament Entry
   └─ Pay entry fees with AION

6. Premium Features
   └─ Access exclusive AI models
```

### Revenue Model

```
Platform Revenue Sources:
├─ Battle Fees (2% of winnings)
├─ Tournament Entry Fees
├─ Premium Subscriptions
├─ AI Model Access Fees
└─ NFT Marketplace (future)

Revenue Distribution:
├─ 50% - Liquidity Pool
├─ 30% - Development & Operations
├─ 15% - Marketing & Growth
└─ 5% - Team
```

---

## 📊 Smart Contract Logic (Future)

### Battle Contract

```solidity
contract AIONBattle {
    struct Battle {
        uint256 id;
        address player1;
        address player2;
        uint256 stake;
        string asset;
        uint256 timeframe;
        uint256 startPrice;
        uint256 endPrice;
        Prediction player1Prediction;
        Prediction player2Prediction;
        BattleStatus status;
        address winner;
    }
    
    enum Prediction { BULLISH, BEARISH }
    enum BattleStatus { PENDING, ACTIVE, COMPLETED, CANCELLED }
    
    mapping(uint256 => Battle) public battles;
    
    function createBattle(
        string memory asset,
        uint256 timeframe,
        Prediction prediction
    ) external payable returns (uint256);
    
    function joinBattle(
        uint256 battleId,
        Prediction prediction
    ) external payable;
    
    function startBattle(uint256 battleId) external;
    
    function resolveBattle(
        uint256 battleId,
        uint256 endPrice
    ) external;
    
    function claimReward(uint256 battleId) external;
}
```

### Price Oracle Integration

```solidity
contract PriceOracle {
    // Chainlink Price Feed integration
    AggregatorV3Interface internal priceFeed;
    
    function getLatestPrice(string memory asset) 
        external view returns (uint256);
    
    function getPriceAtTimestamp(
        string memory asset,
        uint256 timestamp
    ) external view returns (uint256);
}
```

### Escrow System

```
Battle Creation:
├─ Player 1 stakes BNB
├─ Funds locked in contract
├─ Player 2 joins and stakes
├─ Total pot = stake1 + stake2
└─ Battle starts

Battle Resolution:
├─ Oracle provides end price
├─ Contract determines winner
├─ Winner receives pot (minus fees)
├─ Fees distributed to platform
└─ Battle marked as completed
```

---

## 🎮 Game Mechanics

### AI Models

**Available Models:**
```
1. GPT-5 Oracle
   ├─ Strength: Pattern recognition
   ├─ Best for: Short timeframes
   └─ Avg Confidence: 70-85%

2. Claude-3
   ├─ Strength: Market sentiment
   ├─ Best for: Medium timeframes
   └─ Avg Confidence: 65-80%

3. DeepMind-FX
   ├─ Strength: Technical analysis
   ├─ Best for: Long timeframes
   └─ Avg Confidence: 75-90%

4. Bloom-Alpha
   ├─ Strength: Volatility prediction
   ├─ Best for: High volatility assets
   └─ Avg Confidence: 60-75%
```

**AI Prediction Logic (Mock):**
```javascript
function generatePrediction(model, asset, timeframe) {
    // Seed based on model + asset + timeframe
    const seed = hash(model + asset + timeframe + timestamp);
    
    // Generate confidence (40-100%)
    const confidence = 40 + (seed % 60);
    
    // Determine prediction
    const prediction = seed % 2 === 0 ? 'BULLISH' : 'BEARISH';
    
    return { prediction, confidence };
}
```

### Achievements System

**Achievement Categories:**
```
Battle Milestones:
├─ First Blood (1 battle) 🗡️
├─ Warrior (10 battles) 🛡️
├─ Veteran (50 battles) 🏅
└─ Legend (100 battles) 👑

Win Milestones:
├─ Victory (1 win) 🎯
├─ Champion (10 wins) 🏆
└─ Master (50 wins) 💎

Win Streaks:
├─ Hot Streak (3 consecutive) 🔥
└─ Unstoppable (5 consecutive) ⚡

Profit Milestones:
├─ Profitable (1 BNB profit) 💰
└─ Whale (10 BNB profit) 🐋

Battle Type Mastery:
├─ AI Whisperer (20 AI battles won) 🤖
└─ People Person (20 Human battles won) 👥
```

**Achievement Rewards (Future):**
```
Each achievement unlocks:
├─ Badge NFT
├─ AION token reward
├─ Leaderboard points
├─ Exclusive features
└─ Profile customization
```

---

## 📈 Statistics & Analytics

### User Statistics

```
Profile Stats:
├─ Total Battles: Count of all battles
├─ Win Rate: (Wins / Total) × 100%
├─ Total Wagered: Sum of all stakes
├─ Total Won: Sum of all winnings
├─ Total Lost: Sum of all losses
├─ Profit/Loss: Total Won - Total Lost
├─ Best Streak: Longest win streak
├─ Current Streak: Active win streak
└─ Favorite Asset: Most battled asset
```

### Battle History

```
Each Battle Record:
├─ Battle ID
├─ Timestamp
├─ Battle Type (AI vs AI, etc)
├─ Asset (BTC, ETH, etc)
├─ Timeframe (M5, M15, etc)
├─ Stake Amount
├─ Prediction (Bullish/Bearish)
├─ Outcome (Bullish/Bearish)
├─ Result (Win/Loss/Draw)
├─ Payout Amount
└─ AI Models Used (if applicable)
```

### Leaderboard

```
Ranking Criteria:
├─ Total Profit (primary)
├─ Win Rate (secondary)
├─ Total Battles (tiebreaker)
└─ Current Streak (bonus)

Leaderboard Tiers:
├─ Top 10: Diamond 💎
├─ Top 50: Platinum 🏆
├─ Top 100: Gold 🥇
└─ Others: Silver 🥈
```

---

## 🔒 Security Features

### Wallet Security

```
MetaMask Integration:
├─ No private key storage
├─ User controls all transactions
├─ Signature verification
└─ Network validation
```

### Smart Contract Security (Future)

```
Security Measures:
├─ Audited by CertiK
├─ Reentrancy guards
├─ Access control
├─ Emergency pause
├─ Timelock for upgrades
└─ Multi-sig for admin functions
```

### Data Security

```
User Data:
├─ No KYC required (decentralized)
├─ Wallet address only
├─ No personal information stored
└─ Battle history on-chain
```

---

## 🚀 Roadmap

### Phase 1: Testnet Launch (Current)
```
✅ Core battle system
✅ AI vs AI battles
✅ AI vs Human battles
✅ Human vs Human battles
✅ Wallet integration (MetaMask)
✅ Battle history
✅ Achievement system
✅ Notification system
✅ BSC Testnet deployment
```

### Phase 2: Mainnet Launch
```
□ Smart contract deployment
□ AION token launch
□ Real BNB betting
□ Zedpay integration
□ Enhanced AI models
□ Tournament system
□ Leaderboard rewards
```

### Phase 3: Platform Expansion
```
□ Mobile app (iOS/Android)
□ More AI models
□ More crypto assets
□ Social features
□ NFT achievements
□ Staking system
□ Governance DAO
```

### Phase 4: Ecosystem Growth
```
□ API for developers
□ White-label solution
□ Cross-chain support
□ Fiat on-ramp
□ Institutional features
□ Advanced analytics
```

---

**AION-X: Where AI Meets Prediction Gaming on BNB Chain** 🎮⚡

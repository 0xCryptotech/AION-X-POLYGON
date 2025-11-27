# ⚔️ AION-X Battle Mechanics & Staking System

## 🎮 Battle Flow Complete

### 1. AI vs AI Battle

**Step-by-Step:**

```
1. USER SETUP
   ├─ Select AI Model 1 (GPT-5 Oracle)
   ├─ Select AI Model 2 (Claude-3)
   ├─ Choose Asset (BTCUSDT)
   ├─ Choose Timeframe (M5)
   └─ Set Stake Amount (0.1 BNB)

2. AI PREDICTION
   ├─ AI Model 1 → BULLISH (75% confidence)
   ├─ AI Model 2 → BEARISH (68% confidence)
   └─ User chooses which AI to bet on

3. STAKE LOCKING
   ├─ User stakes 0.1 BNB
   ├─ Platform fee: 0.005 BNB (5%)
   ├─ Net stake: 0.095 BNB
   ├─ Funds locked in smart contract
   └─ Battle ID created

4. BATTLE START
   ├─ Record starting price: $43,250
   ├─ Start countdown: 5 seconds
   ├─ Monitor price real-time
   └─ Wait for timeframe (5 minutes)

5. PRICE MONITORING
   ├─ WebSocket connection to Binance
   ├─ Update price every 300ms
   ├─ Display live ticker
   └─ Track price movement

6. BATTLE END
   ├─ Record ending price: $43,580
   ├─ Calculate outcome: BULLISH
   ├─ Determine winner: AI Model 1
   └─ Check user's bet

7. PAYOUT
   ├─ User bet on AI Model 1 ✅
   ├─ User wins!
   ├─ Payout: 0.19 BNB (2x net stake)
   ├─ Transfer to user wallet
   └─ Update statistics

8. POST-BATTLE
   ├─ Save to battle history
   ├─ Update win/loss stats
   ├─ Check achievements
   ├─ Send notification
   └─ Update leaderboard
```

---

## 💰 Staking Mechanism

### Stake Structure

**Single Battle Stake:**
```
User Input: 0.1 BNB
├─ Platform Fee (5%): 0.005 BNB
├─ Net Stake: 0.095 BNB
└─ Locked in Contract

Potential Outcomes:
├─ Win: 0.19 BNB (2x net stake)
├─ Loss: 0 BNB
└─ Draw: 0.095 BNB (return net stake)
```

**AI vs AI Battle:**
```
User stakes: 0.1 BNB
House stakes: 0.1 BNB (for losing AI)
Total pot: 0.2 BNB
Platform fee: 0.01 BNB (5% from both)
Net pot: 0.19 BNB
Winner gets: 0.19 BNB
```

**Human vs Human Battle:**
```
Player 1 stakes: 0.1 BNB
Player 2 stakes: 0.1 BNB
Total pot: 0.2 BNB
Platform fee: 0.01 BNB (5% total)
Net pot: 0.19 BNB
Winner gets: 0.19 BNB
Loser gets: 0 BNB
```

### Stake Limits

**Minimum & Maximum:**
```
Minimum Stake: 0.01 BNB ($3)
Maximum Stake: 10 BNB ($3,000)

Tier Limits:
├─ Free Users: 0.01 - 0.5 BNB
├─ Silver: 0.01 - 2 BNB
├─ Gold: 0.01 - 5 BNB
└─ Diamond: 0.01 - 10 BNB
```

### Dynamic Stake Multipliers

**Based on Confidence:**
```
AI Confidence < 60%: 2.5x payout
AI Confidence 60-70%: 2.0x payout
AI Confidence 70-80%: 1.8x payout
AI Confidence > 80%: 1.5x payout

Example:
Stake: 0.1 BNB
AI Confidence: 55%
Payout: 0.25 BNB (2.5x)
```

---

## 🔒 Smart Contract Logic

### Battle Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIONBattle {
    
    struct Battle {
        uint256 id;
        address player;
        uint256 stake;
        uint256 netStake;
        uint256 fee;
        string asset;
        uint256 timeframe;
        uint256 startPrice;
        uint256 endPrice;
        Prediction prediction;
        BattleStatus status;
        uint256 startTime;
        uint256 endTime;
        bool claimed;
    }
    
    enum Prediction { BULLISH, BEARISH }
    enum BattleStatus { PENDING, ACTIVE, COMPLETED, CANCELLED }
    
    uint256 public platformFeePercent = 5;
    uint256 public battleCounter;
    address public feeCollector;
    address public priceOracle;
    
    mapping(uint256 => Battle) public battles;
    mapping(address => uint256[]) public userBattles;
    
    event BattleCreated(uint256 indexed battleId, address indexed player, uint256 stake);
    event BattleStarted(uint256 indexed battleId, uint256 startPrice);
    event BattleCompleted(uint256 indexed battleId, bool won, uint256 payout);
    event PayoutClaimed(uint256 indexed battleId, address indexed player, uint256 amount);
    
    constructor(address _feeCollector, address _priceOracle) {
        feeCollector = _feeCollector;
        priceOracle = _priceOracle;
    }
    
    // Create battle and lock stake
    function createBattle(
        string memory asset,
        uint256 timeframe,
        Prediction prediction
    ) external payable returns (uint256) {
        require(msg.value >= 0.01 ether, "Minimum stake is 0.01 BNB");
        require(msg.value <= 10 ether, "Maximum stake is 10 BNB");
        
        uint256 fee = (msg.value * platformFeePercent) / 100;
        uint256 netStake = msg.value - fee;
        
        battleCounter++;
        uint256 battleId = battleCounter;
        
        battles[battleId] = Battle({
            id: battleId,
            player: msg.sender,
            stake: msg.value,
            netStake: netStake,
            fee: fee,
            asset: asset,
            timeframe: timeframe,
            startPrice: 0,
            endPrice: 0,
            prediction: prediction,
            status: BattleStatus.PENDING,
            startTime: 0,
            endTime: 0,
            claimed: false
        });
        
        userBattles[msg.sender].push(battleId);
        
        // Transfer fee to collector
        payable(feeCollector).transfer(fee);
        
        emit BattleCreated(battleId, msg.sender, msg.value);
        
        return battleId;
    }
    
    // Start battle and record price
    function startBattle(uint256 battleId, uint256 startPrice) external {
        require(msg.sender == priceOracle, "Only oracle can start");
        Battle storage battle = battles[battleId];
        require(battle.status == BattleStatus.PENDING, "Battle not pending");
        
        battle.startPrice = startPrice;
        battle.startTime = block.timestamp;
        battle.endTime = block.timestamp + battle.timeframe;
        battle.status = BattleStatus.ACTIVE;
        
        emit BattleStarted(battleId, startPrice);
    }
    
    // Complete battle and determine winner
    function completeBattle(uint256 battleId, uint256 endPrice) external {
        require(msg.sender == priceOracle, "Only oracle can complete");
        Battle storage battle = battles[battleId];
        require(battle.status == BattleStatus.ACTIVE, "Battle not active");
        require(block.timestamp >= battle.endTime, "Battle not finished");
        
        battle.endPrice = endPrice;
        battle.status = BattleStatus.COMPLETED;
        
        bool won = checkWinner(battle, endPrice);
        uint256 payout = won ? battle.netStake * 2 : 0;
        
        emit BattleCompleted(battleId, won, payout);
    }
    
    // Check if player won
    function checkWinner(Battle memory battle, uint256 endPrice) internal pure returns (bool) {
        if (endPrice > battle.startPrice) {
            return battle.prediction == Prediction.BULLISH;
        } else if (endPrice < battle.startPrice) {
            return battle.prediction == Prediction.BEARISH;
        } else {
            return false; // Draw
        }
    }
    
    // Claim payout
    function claimPayout(uint256 battleId) external {
        Battle storage battle = battles[battleId];
        require(battle.player == msg.sender, "Not your battle");
        require(battle.status == BattleStatus.COMPLETED, "Battle not completed");
        require(!battle.claimed, "Already claimed");
        
        bool won = checkWinner(battle, battle.endPrice);
        uint256 payout;
        
        if (won) {
            payout = battle.netStake * 2;
        } else if (battle.endPrice == battle.startPrice) {
            payout = battle.netStake; // Return stake on draw
        } else {
            payout = 0; // Loss
        }
        
        battle.claimed = true;
        
        if (payout > 0) {
            payable(msg.sender).transfer(payout);
        }
        
        emit PayoutClaimed(battleId, msg.sender, payout);
    }
    
    // Get user's battles
    function getUserBattles(address user) external view returns (uint256[] memory) {
        return userBattles[user];
    }
    
    // Emergency cancel (only before start)
    function cancelBattle(uint256 battleId) external {
        Battle storage battle = battles[battleId];
        require(battle.player == msg.sender, "Not your battle");
        require(battle.status == BattleStatus.PENDING, "Cannot cancel");
        
        battle.status = BattleStatus.CANCELLED;
        
        // Refund stake (minus fee already sent)
        payable(msg.sender).transfer(battle.netStake);
    }
}
```

---

## 🎯 Battle Types Detailed

### Type 1: AI vs AI

**Mechanism:**
```
1. User selects 2 AI models
2. Both AIs make predictions
3. User bets on one AI
4. Platform acts as house for other AI
5. Winner determined by actual price
6. User wins if their chosen AI was correct
```

**Stake Flow:**
```
User: 0.1 BNB → Contract
House: 0.1 BNB → Contract (virtual)
Total: 0.2 BNB
Fee: 0.01 BNB → Platform
Net: 0.19 BNB → Winner
```

**Risk:**
- User: Loses 0.1 BNB if wrong
- Platform: Pays 0.19 BNB if user wins
- Platform: Keeps 0.1 BNB if user loses

### Type 2: AI vs Human

**Mechanism:**
```
1. User selects 1 AI model
2. AI makes prediction
3. User makes own prediction
4. Both predictions locked
5. Winner determined by actual price
6. Winner gets payout
```

**Stake Flow:**
```
User: 0.1 BNB → Contract
AI (House): 0.1 BNB → Contract (virtual)
Total: 0.2 BNB
Fee: 0.01 BNB → Platform
Net: 0.19 BNB → Winner
```

### Type 3: Human vs Human

**Mechanism:**
```
1. Player 1 creates room
2. Player 2 joins room
3. Both stake same amount
4. Both make predictions
5. Winner determined by actual price
6. Winner takes pot
```

**Stake Flow:**
```
Player 1: 0.1 BNB → Contract
Player 2: 0.1 BNB → Contract
Total: 0.2 BNB
Fee: 0.01 BNB → Platform
Net: 0.19 BNB → Winner
```

**Matching System:**
```
Room Creation:
├─ Player 1 sets stake amount
├─ Player 1 makes prediction (hidden)
├─ Room listed in lobby
└─ Waiting for Player 2

Room Join:
├─ Player 2 sees available rooms
├─ Player 2 stakes same amount
├─ Player 2 makes prediction (hidden)
├─ Both predictions revealed
└─ Battle starts
```

---

## 🏆 Payout Calculation

### Standard Payout (2x)

```javascript
function calculatePayout(stake, won, draw) {
  const fee = stake * 0.05;
  const netStake = stake - fee;
  
  if (won) {
    return netStake * 2; // Win
  } else if (draw) {
    return netStake; // Return stake
  } else {
    return 0; // Loss
  }
}

// Example:
stake = 0.1 BNB
won = true
payout = (0.1 - 0.005) * 2 = 0.19 BNB
```

### Dynamic Payout (Based on Confidence)

```javascript
function calculateDynamicPayout(stake, confidence, won) {
  const fee = stake * 0.05;
  const netStake = stake - fee;
  
  let multiplier;
  if (confidence < 60) multiplier = 2.5;
  else if (confidence < 70) multiplier = 2.0;
  else if (confidence < 80) multiplier = 1.8;
  else multiplier = 1.5;
  
  return won ? netStake * multiplier : 0;
}

// Example:
stake = 0.1 BNB
confidence = 55%
won = true
payout = 0.095 * 2.5 = 0.2375 BNB
```

### Streak Bonus

```javascript
function calculateStreakBonus(payout, streak) {
  if (streak >= 5) return payout * 1.2; // +20%
  if (streak >= 3) return payout * 1.1; // +10%
  return payout;
}

// Example:
basePayout = 0.19 BNB
streak = 5
finalPayout = 0.19 * 1.2 = 0.228 BNB
```

---

## 🔐 Security Measures

### Anti-Manipulation

**1. Price Oracle:**
```
- Use Chainlink price feeds
- Multiple data sources
- Median price calculation
- Delay mechanism (prevent front-running)
```

**2. Time Locks:**
```
- Predictions locked before battle start
- Cannot change after submission
- Minimum battle duration: 1 minute
- Maximum battle duration: 1 hour
```

**3. Stake Limits:**
```
- Per battle: 0.01 - 10 BNB
- Per day: 50 BNB
- Per user: Based on tier
- Cooldown: 10 seconds between battles
```

**4. Bot Prevention:**
```
- Rate limiting
- CAPTCHA for high-value battles
- Wallet age verification
- Behavior analysis
```

---

## 📊 Battle Statistics

### Tracked Metrics:

```javascript
{
  battleId: 12345,
  player: "0x123...",
  type: "AI vs AI",
  asset: "BTCUSDT",
  timeframe: 300, // 5 minutes
  stake: 0.1,
  netStake: 0.095,
  fee: 0.005,
  prediction: "BULLISH",
  aiModel: "GPT-5 Oracle",
  aiConfidence: 75,
  startPrice: 43250,
  endPrice: 43580,
  outcome: "BULLISH",
  result: "WIN",
  payout: 0.19,
  profit: 0.09,
  timestamp: 1699123456,
  duration: 300
}
```

---

## 🎮 User Experience Flow

### Frontend Implementation:

```javascript
// Battle Setup
const [stake, setStake] = useState(0.1);
const [selectedAI, setSelectedAI] = useState('GPT-5 Oracle');

// Calculate fees
const platformFee = stake * 0.05;
const netStake = stake - platformFee;
const potentialWin = netStake * 2;

// Display to user
<div className="stake-info">
  <div>Your Stake: {stake} BNB</div>
  <div>Platform Fee (5%): {platformFee} BNB</div>
  <div>Net Stake: {netStake} BNB</div>
  <div>Potential Win: {potentialWin} BNB</div>
  <div>Potential Profit: {potentialWin - stake} BNB</div>
</div>

// Start battle
async function startBattle() {
  // 1. Lock stake in contract
  const tx = await contract.createBattle(asset, timeframe, prediction, {
    value: ethers.utils.parseEther(stake.toString())
  });
  
  // 2. Wait for confirmation
  await tx.wait();
  
  // 3. Start price monitoring
  startPriceMonitoring(battleId);
  
  // 4. Wait for timeframe
  await waitForTimeframe(timeframe);
  
  // 5. Complete battle
  await contract.completeBattle(battleId, endPrice);
  
  // 6. Claim payout
  if (won) {
    await contract.claimPayout(battleId);
  }
}
```

---

## ✅ Summary

**Stake Mechanism:**
- User stakes BNB
- 5% platform fee deducted
- Net stake locked in contract
- Winner gets 2x net stake
- Loser gets nothing
- Draw returns net stake

**Battle Types:**
- AI vs AI: User bets on AI
- AI vs Human: User vs AI
- Human vs Human: P2P battles

**Security:**
- Smart contract escrow
- Price oracle verification
- Time locks
- Stake limits
- Anti-bot measures

**Payout:**
- Standard: 2x multiplier
- Dynamic: Based on confidence
- Bonus: Streak rewards
- Instant: Auto-claim

---

**Status: Complete Battle Mechanics** ⚔️✨

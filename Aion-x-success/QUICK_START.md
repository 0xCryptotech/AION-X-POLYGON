# AION-X Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MetaMask browser extension
- BNB in your wallet (for testing on BSC)

### Installation

```bash
cd /Users/idcuq/Documents/DORAHACKS/app-main/frontend
npm install
npm run dev
```

Application will run on `http://localhost:5173`

---

## 🎮 Feature Walkthrough

### 1. Connect Your Wallet

1. Click **"Connect Wallet"** button in navbar
2. Choose **MetaMask** or **Zedpay**
3. Approve connection in MetaMask
4. App will auto-switch to BNB Chain if needed
5. Your balance will display in navbar

**Code Example:**
```javascript
import { useWallet } from '@/context/WalletContext';

const { isConnected, address, balance, connectMetaMask } = useWallet();
```

---

### 2. Start a Battle

1. Go to **Battle** page
2. Choose battle mode:
   - AI vs AI
   - AI vs Human
   - Human vs Human
3. Select AI model from dropdown
4. Select asset (BTC, ETH, SOL, etc.)
5. Choose timeframe
6. Place your bet
7. Watch the battle!

**Battle will automatically:**
- Save to history
- Update statistics
- Check for achievements
- Send notifications

---

### 3. View Your History

1. Go to **History** page
2. See your statistics:
   - Total Battles
   - Win Rate
   - Total Won
   - Profit/Loss
3. Filter battles:
   - By result (Win/Loss/Draw)
   - By type (AI vs AI, etc.)
4. View detailed battle records

**Code Example:**
```javascript
import { useBattleHistory } from '@/context/BattleHistoryContext';

const { battles, stats, addBattle } = useBattleHistory();

// Add battle after completion
addBattle({
  type: 'ai-vs-ai',
  asset: 'BTCUSDT',
  prediction: 'Bullish',
  outcome: 'Bullish',
  result: 'win',
  stake: 0.1,
  payout: 0.2,
});
```

---

### 4. Unlock Achievements

Achievements unlock automatically as you:
- Complete battles
- Win battles
- Build win streaks
- Earn profits

**View Your Achievements:**
1. Go to **Achievements** page
2. See all 13 achievements
3. Track your progress
4. View locked/unlocked badges

**Achievement Categories:**
- 🗡️ Battle Milestones (1, 10, 50, 100)
- 🎯 Win Milestones (1, 10, 50)
- 🔥 Win Streaks (3, 5)
- 💰 Profit Milestones (1, 10 BNB)
- 🤖 Battle Type Mastery

**Code Example:**
```javascript
import { useAchievements } from '@/context/AchievementContext';

const { updateProgress } = useAchievements();

// Update after battle
updateProgress({
  battles: 10,
  wins: 5,
  streak: 3,
  profit: 1.5,
});
```

---

### 5. Receive Notifications

Notifications appear automatically for:
- Wallet connection/disconnection
- Battle results
- Achievement unlocks
- Important events

**Code Example:**
```javascript
import { useNotifications } from '@/context/NotificationContext';

const { addNotification } = useNotifications();

addNotification({
  type: 'success',
  title: 'Victory!',
  message: 'You won 0.2 BNB!',
});
```

---

## 🔧 Developer Integration

### Integrate with Existing Battle Modals

**Step 1: Import Contexts**
```javascript
import { useBattleHistory } from '@/context/BattleHistoryContext';
import { useAchievements } from '@/context/AchievementContext';
import { useNotifications } from '@/context/NotificationContext';
```

**Step 2: Use in Component**
```javascript
function AIBattleModal() {
  const { addBattle, stats } = useBattleHistory();
  const { updateProgress } = useAchievements();
  const { addNotification } = useNotifications();

  const handleBattleComplete = (battleData) => {
    // 1. Add to history
    const battleId = addBattle({
      type: 'ai-vs-ai',
      asset: battleData.asset,
      prediction: battleData.userPrediction,
      outcome: battleData.actualOutcome,
      result: battleData.userWon ? 'win' : 'loss',
      stake: battleData.stakeAmount,
      payout: battleData.userWon ? battleData.stakeAmount * 2 : 0,
    });

    // 2. Update achievements
    updateProgress({
      battles: stats.totalBattles + 1,
      wins: battleData.userWon ? stats.wins + 1 : stats.wins,
      streak: calculateCurrentStreak(),
      profit: stats.profitLoss + (battleData.userWon ? battleData.stakeAmount : -battleData.stakeAmount),
      ai_battles: stats.ai_battles + 1,
    });

    // 3. Send notification
    addNotification({
      type: battleData.userWon ? 'success' : 'error',
      title: battleData.userWon ? '🎉 Victory!' : '😔 Defeat',
      message: battleData.userWon 
        ? `You won ${battleData.payout} BNB!` 
        : `You lost ${battleData.stakeAmount} BNB`,
    });
  };

  return (
    // Your modal JSX
  );
}
```

---

## 📱 Pages Overview

### Home (Markets)
- View available markets
- See live prices
- Quick access to battles

### Battle
- AI vs AI battles
- AI vs Human battles
- Human vs Human battles
- Live price feeds
- AI model selection

### Tournament
- Coming Soon status
- Future tournament features

### Portfolio
- User profile with avatar upload
- Wallet address display
- Rank and level
- Edit profile

### History ⭐ NEW
- Battle history with filters
- Statistics dashboard
- Win rate tracking
- Profit/Loss analysis

### Achievements ⭐ NEW
- 13 unlockable badges
- Progress tracking
- Completion percentage
- Visual locked/unlocked states

### Leaderboard
- Top players ranking
- Performance metrics

### How It Works
- Platform explanation
- Feature guides

---

## 🎯 Testing Guide

### Test Wallet Connection
```bash
1. Open app in browser
2. Click "Connect Wallet"
3. Select MetaMask
4. Approve connection
5. Check balance displays
6. Try disconnecting
7. Reconnect to test persistence
```

### Test Battle Flow
```bash
1. Go to Battle page
2. Open AI vs AI modal
3. Select models from dropdowns
4. Choose asset and timeframe
5. Set stake amount
6. Start battle
7. Check History page for record
8. Check Achievements for progress
9. Look for notification toast
```

### Test Achievements
```bash
1. Complete 1 battle → "First Blood" unlocks
2. Win 1 battle → "Victory" unlocks
3. Win 3 in a row → "Hot Streak" unlocks
4. Check Achievements page for progress
5. Verify notifications appear
```

---

## 🐛 Troubleshooting

### MetaMask Not Connecting
- Ensure MetaMask extension is installed
- Check if MetaMask is unlocked
- Try refreshing the page
- Clear browser cache

### Wrong Network
- App will auto-prompt to switch to BNB Chain
- Manually switch in MetaMask if needed
- Network: BNB Smart Chain (Chain ID: 56)

### Balance Not Showing
- Ensure you're on BNB Chain
- Check MetaMask has BNB
- Refresh the page
- Reconnect wallet

### Achievements Not Unlocking
- Check progress in Achievements page
- Ensure battles are being added to history
- Verify updateProgress is called after battles
- Check browser console for errors

---

## 📚 API Reference

### WalletContext
```javascript
const {
  isConnected,      // boolean
  address,          // string
  balance,          // string
  chainId,          // string
  walletType,       // 'metamask' | 'zedpay'
  connectMetaMask,  // () => Promise<void>
  connectZedpay,    // () => Promise<void>
  disconnectWallet, // () => void
  switchToBNBChain, // () => Promise<void>
} = useWallet();
```

### BattleHistoryContext
```javascript
const {
  battles,              // Array<Battle>
  stats,                // StatsObject
  addBattle,            // (battle) => battleId
  getBattlesByType,     // (type) => Array<Battle>
  getBattlesByResult,   // (result) => Array<Battle>
  clearHistory,         // () => void
} = useBattleHistory();
```

### NotificationContext
```javascript
const {
  notifications,        // Array<Notification>
  unreadCount,          // number
  addNotification,      // (notif) => notifId
  markAsRead,           // (id) => void
  markAllAsRead,        // () => void
  clearNotification,    // (id) => void
  clearAll,             // () => void
} = useNotifications();
```

### AchievementContext
```javascript
const {
  achievements,           // Array<Achievement>
  unlockedAchievements,   // Array<string>
  progress,               // ProgressObject
  updateProgress,         // (updates) => void
  getAchievementProgress, // (id) => number
  unlockedCount,          // number
  totalCount,             // number
  completionRate,         // string
} = useAchievements();
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

### Environment Variables
```env
VITE_BNB_RPC_URL=https://bsc-dataseed.binance.org/
VITE_CHAIN_ID=0x38
```

---

## 📞 Support

Need help? Check:
1. `/NEW_FEATURES.md` - Detailed feature documentation
2. `/IMPLEMENTATION_SUMMARY.md` - Technical overview
3. Browser console for errors
4. MetaMask connection status

---

## 🎉 You're Ready!

Start building amazing prediction battles on AION-X! 🚀

**Happy Coding!** 💻✨

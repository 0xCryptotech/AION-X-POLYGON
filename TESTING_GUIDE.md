# AION-X Public Testing Guide

## Live App
🌐 **https://aion-x.vercel.app/**

## Prerequisites
1. **MetaMask** installed
2. **Polygon Amoy Testnet** configured:
   - Network Name: Polygon Amoy Testnet
   - RPC URL: https://rpc-amoy.polygon.technology/
   - Chain ID: 80002
   - Currency: MATIC
   - Block Explorer: https://amoy.polygonscan.com/

3. **Get test MATIC** for gas fees:
   - https://faucet.polygon.technology/

## Testing Steps

### 1. Get AION Tokens
1. Connect wallet at https://aion-x.vercel.app/
2. Go to **Faucet** page
3. Click "Claim 100 AION"
4. Wait for transaction confirmation
5. AION balance will appear in Portfolio

### 2. Start a Battle
1. Go to **Battle** page
2. Choose battle mode:
   - **AI vs AI**: Bet on AI predictions
   - **AI vs Human**: Compete against AI
   - **Human vs Human**: Challenge other players
3. Select:
   - Asset (BTC, ETH, SOL, MATIC, XRP)
   - Timeframe (M1, M5, M10, M15, M30, H1)
   - AI Model (for AI battles)
4. Enter stake amount (min 10 AION)
5. Click "Start Battle"
6. Approve AION token (MetaMask popup 1)
7. Confirm bet (MetaMask popup 2)
8. Wait for battle timer to complete

### 3. View Results
- **Result Modal**: Shows win/loss after battle
- **Portfolio**: View battle history and claimable rewards
- **Withdraw**: Claim your winnings

## Smart Contracts (Polygon Amoy Testnet)
After deployment, contract addresses will be listed here:
- **AION Token**: `Deploy using: npx hardhat run scripts/deployAll.ts --network polygonAmoy`
- **Prediction Market**: `Deploy using: npx hardhat run scripts/deployAll.ts --network polygonAmoy`
- **Staking Contract**: `Deploy using: npx hardhat run scripts/deployAll.ts --network polygonAmoy`
- **Faucet**: `Deploy using: npx hardhat run scripts/deployAll.ts --network polygonAmoy`
- **Faucet**: `TBD - Deploy to Polygon Amoy`

## Features to Test
✅ Wallet connection
✅ Faucet claim (100 AION per 24h)
✅ Battle modes (AI vs AI, AI vs Human, Human vs Human)
✅ Real-time crypto price feeds
✅ Battle timer and countdown
✅ Result modal with win/loss
✅ Battle history in Portfolio
✅ Claimable rewards
✅ Withdraw functionality
✅ Tournament page
✅ Leaderboard

## Known Issues
- Backend auto-resolve runs locally (need 24/7 server deployment)
- Result modal may timeout if backend is offline
- Check Portfolio for rewards if modal doesn't appear

## Support
Report issues: https://github.com/IdcuqS07/Aion-x/issues

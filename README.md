# 🎯 AION-X - AI-Powered Prediction Market on Polygon

<div align="center">

![AION-X Banner](https://img.shields.io/badge/AION--X-Polygon%20Amoy-8247E5?style=for-the-badge)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![Polygon](https://img.shields.io/badge/Polygon-Amoy-8247E5?style=for-the-badge&logo=polygon)](https://polygon.technology/)

**Decentralized Prediction Market with AI Integration and Revenue Sharing**

[Live Demo](http://localhost:3000) • [Documentation](./CONTRACTS_GUIDE.md) • [Deployment Guide](./DEPLOY_TO_POLYGON.md)

</div>

---

## 🌟 Features

### 🎮 Three Battle Modes
- **AI vs AI**: Bet on AI predictions competing against each other
- **AI vs Human**: Challenge AI with your own predictions
- **Human vs Human**: Compete directly with other traders

### 💰 Revenue Sharing Model
- **2% Platform Fee** on all battles
- **Automatic Distribution** to stakers
- **Variable APY** based on platform volume
- **7-Day Lock Period** for staking

### 🎁 Testnet Faucet
- **100 AION** per claim
- **24-Hour Cooldown**
- Free tokens for testing

### 🔒 Security Features
- Owner-only critical functions
- Oracle-based resolution
- Time-based market closure
- Reentrancy protection

---

## 📋 Deployed Contracts (Polygon Amoy)

| Contract | Address | Explorer |
|----------|---------|----------|
| **AION Token** | `0x1Ef64Ab093620c73DC656f57D0f7A7061586f331` | [View](https://amoy.polygonscan.com/address/0x1Ef64Ab093620c73DC656f57D0f7A7061586f331) |
| **Prediction Market** | `0x2C3B12e01313A8336179c5c850d64335137FAbab` | [View](https://amoy.polygonscan.com/address/0x2C3B12e01313A8336179c5c850d64335137FAbab) |
| **Staking Contract** | `0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5` | [View](https://amoy.polygonscan.com/address/0x16a22CfAde51cBF537e8F97BeAa8D2BA7c2217a5) |
| **Faucet** | `0x765622d95D072c00209Cd87e60EfCf472bDF423D` | [View](https://amoy.polygonscan.com/address/0x765622d95D072c00209Cd87e60EfCf472bDF423D) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MetaMask wallet
- Test MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

### Installation

```bash
# Clone repository
git clone https://github.com/0xCryptotech/AION-X-POLYGON.git
cd AION-X-POLYGON

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../hardhat && npm install
```

### Configuration

#### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

#### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
# Edit .env with contract addresses
```

#### 3. Start Application
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Open browser
open http://localhost:3000
```

---

## 📚 Documentation

- **[Deployment Guide](./DEPLOY_TO_POLYGON.md)** - Complete deployment instructions
- **[Contracts Guide](./CONTRACTS_GUIDE.md)** - Smart contract documentation
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
- **[Contract Summary](./CONTRACT_SUMMARY.md)** - Technical overview
- **[Deployment Success](./DEPLOYMENT_SUCCESS.md)** - Latest deployment info

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AION-X Platform                       │
│                     Polygon Amoy Testnet                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│  AIONToken   │◄───│ PredictionMarket │───►│ AIONStaking  │
│   (ERC-20)   │    │   (Core Logic)   │    │ (Rev Share)  │
└──────────────┘    └──────────────────┘    └──────────────┘
        ▲                     │
        │                     │
        │                     ▼
┌──────────────┐    ┌──────────────────┐
│ AIONFaucet   │    │   Users/Bettors  │
│ (Testnet)    │    │                  │
└──────────────┘    └──────────────────┘
```

---

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** 0.8.19
- **Hardhat** - Development framework
- **OpenZeppelin** - Security standards
- **Ethers.js** - Blockchain interaction

### Backend
- **Node.js** + **TypeScript**
- **Express** - REST API
- **Prisma** - Database ORM
- **SQLite** - Database

### Frontend
- **React** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Ethers.js** - Web3 integration

---

## 💡 How It Works

### 1. Create Market
Owner creates prediction markets with:
- Title and outcomes
- Close time
- Battle mode (AI vs AI, AI vs Human, Human vs Human)

### 2. Place Bets
Users stake AION tokens on their predicted outcome:
- Approve AION token
- Place bet with chosen outcome
- Wait for market closure

### 3. Market Resolution
Oracle resolves market with winning outcome:
- 2% platform fee deducted
- Fee sent to staking contract
- Winners receive proportional share

### 4. Claim Rewards
Winners claim their rewards:
- Original stake + profit
- Automatic calculation
- Instant withdrawal

### 5. Stake & Earn
Users can stake AION to earn platform fees:
- Min stake: 100 AION
- Lock period: 7 days
- Earn 2% of all battle fees
- Variable APY based on volume

---

## 📊 Tokenomics

### AION Token
- **Total Supply**: 1,000,000,000 AION
- **Decimals**: 18
- **Type**: ERC-20
- **Network**: Polygon Amoy

### Revenue Model
- **Platform Fee**: 2% of total staked
- **Distribution**: 100% to stakers
- **Staking Rewards**: Proportional to stake
- **Lock Period**: 7 days

---

## 🔐 Security

### Implemented
- ✅ Owner-only critical functions
- ✅ Oracle-only resolution
- ✅ Time-based market closure
- ✅ Reentrancy protection
- ✅ Input validation
- ✅ Event emission

### ⚠️ Important
- This is a **TESTNET** deployment
- Do **NOT** use on mainnet without professional audit
- Keep private keys secure
- Never share sensitive information

---

## 🧪 Testing

### Run Tests
```bash
cd hardhat
npx hardhat test
```

### Deploy to Testnet
```bash
cd hardhat
npx hardhat run scripts/deployAll.ts --network polygonAmoy
```

### Create Test Markets
```bash
npx hardhat run scripts/seedDemoData.ts --network polygonAmoy
```

---

## 📈 Roadmap

### Phase 1: Testnet Launch ✅
- [x] Deploy contracts to Polygon Amoy
- [x] Launch frontend application
- [x] Implement faucet
- [x] Basic testing

### Phase 2: Features (In Progress)
- [ ] AI integration for predictions
- [ ] Advanced analytics dashboard
- [ ] Tournament system
- [ ] NFT achievements

### Phase 3: Mainnet Preparation
- [ ] Professional security audit
- [ ] Bug bounty program
- [ ] Community testing
- [ ] Mainnet deployment

### Phase 4: Expansion
- [ ] Multi-chain support
- [ ] Mobile app
- [ ] API for developers
- [ ] Governance token

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Website**: [Coming Soon]
- **Twitter**: [Coming Soon]
- **Discord**: [Coming Soon]
- **Documentation**: [Docs](./CONTRACTS_GUIDE.md)
- **Polygon Amoy Explorer**: [PolygonScan](https://amoy.polygonscan.com/)

---

## 📞 Support

- **GitHub Issues**: [Report Bug](https://github.com/0xCryptotech/AION-X-POLYGON/issues)
- **Polygon Docs**: [Documentation](https://docs.polygon.technology/)
- **Hardhat Docs**: [Documentation](https://hardhat.org/docs)

---

## ⚠️ Disclaimer

This is an experimental project deployed on testnet. Use at your own risk. Always do your own research before interacting with smart contracts.

---

<div align="center">

**Built with ❤️ on Polygon**

[⬆ Back to Top](#-aion-x---ai-powered-prediction-market-on-polygon)

</div>

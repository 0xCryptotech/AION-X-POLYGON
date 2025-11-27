const { PrismaClient } = require('@prisma/client');
const { ethers } = require('ethers');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const prisma = new PrismaClient();

async function testMarketCreation() {
  console.log('🧪 Testing Market Creation Setup\n');
  
  // 1. Check environment variables
  console.log('1️⃣ Environment Variables:');
  console.log('   PROVIDER_URL:', process.env.PROVIDER_URL ? '✓ Set' : '✗ Missing');
  console.log('   CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS || '✗ Missing');
  console.log('   OWNER_PRIVATE_KEY:', process.env.OWNER_PRIVATE_KEY ? '✓ Set' : '✗ Missing');
  console.log('');
  
  if (!process.env.PROVIDER_URL || !process.env.CONTRACT_ADDRESS || !process.env.OWNER_PRIVATE_KEY) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }
  
  // 2. Check blockchain connection
  console.log('2️⃣ Testing Blockchain Connection:');
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
    const network = await provider.getNetwork();
    console.log('   ✓ Connected to network:', network.name, `(chainId: ${network.chainId})`);
    
    const blockNumber = await provider.getBlockNumber();
    console.log('   ✓ Current block:', blockNumber);
    
    // Check wallet balance
    const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
    const balance = await wallet.getBalance();
    console.log('   ✓ Wallet address:', wallet.address);
    console.log('   ✓ Wallet balance:', ethers.utils.formatEther(balance), 'POL');
    
    if (balance.eq(0)) {
      console.log('   ⚠️  WARNING: Wallet has 0 balance - cannot create markets!');
    }
  } catch (error) {
    console.error('   ✗ Blockchain connection failed:', error.message);
    process.exit(1);
  }
  console.log('');
  
  // 3. Check contract ABI
  console.log('3️⃣ Checking Contract ABI:');
  const abiPath = __dirname + '/abi/PredictionMarket.json';
  try {
    if (!fs.existsSync(abiPath)) {
      console.error('   ✗ ABI file not found:', abiPath);
      process.exit(1);
    }
    const contractJson = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const contractAbi = contractJson.abi || contractJson;
    console.log('   ✓ ABI loaded successfully');
    
    // Check if createMarket function exists
    const hasCreateMarket = contractAbi.some(item => item.name === 'createMarket');
    console.log('   ✓ createMarket function:', hasCreateMarket ? 'Found' : '✗ Not found');
  } catch (error) {
    console.error('   ✗ Failed to load ABI:', error.message);
    process.exit(1);
  }
  console.log('');
  
  // 4. Check database
  console.log('4️⃣ Checking Database:');
  try {
    const openMarkets = await prisma.market.findMany({
      where: { status: 'OPEN' }
    });
    console.log('   ✓ Database connected');
    console.log('   ✓ Open markets:', openMarkets.length);
    
    if (openMarkets.length > 0) {
      console.log('   📊 Latest open market:');
      const latest = openMarkets[openMarkets.length - 1];
      console.log('      - ID:', latest.id);
      console.log('      - Title:', latest.title);
      console.log('      - Close Time:', latest.closeTime);
      console.log('      - Status:', latest.status);
    }
  } catch (error) {
    console.error('   ✗ Database error:', error.message);
    process.exit(1);
  }
  console.log('');
  
  // 5. Try to create a test market
  console.log('5️⃣ Attempting Test Market Creation:');
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
    const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
    const abiPath = __dirname + '/abi/PredictionMarket.json';
    const contractJson = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const contractAbi = contractJson.abi || contractJson;
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, wallet);
    
    const closeTimeEpoch = Math.floor(Date.now() / 1000) + (10 * 60);
    const title = 'TEST: BTC/USD 10min Battle';
    const outcomes = ['Bullish', 'Bearish'];
    const oracle = wallet.address;
    
    console.log('   📝 Creating market:', title);
    console.log('   ⏰ Close time:', new Date(closeTimeEpoch * 1000).toLocaleString());
    
    const tx = await contract.createMarket(
      title,
      outcomes,
      closeTimeEpoch,
      oracle,
      0, // mode: AI_VS_AI
      {
        gasLimit: 3000000,
        maxFeePerGas: ethers.utils.parseUnits('50', 'gwei'),
        maxPriorityFeePerGas: ethers.utils.parseUnits('30', 'gwei')
      }
    );
    
    console.log('   ⏳ Transaction sent:', tx.hash);
    console.log('   ⏳ Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('   ✅ Market created on-chain!');
    console.log('   📦 Block:', receipt.blockNumber);
    console.log('   ⛽ Gas used:', receipt.gasUsed.toString());
    
    // Create in database
    const market = await prisma.market.create({
      data: {
        title,
        outcomes: JSON.stringify(outcomes),
        closeTime: new Date(closeTimeEpoch * 1000),
        mode: 'AI_VS_AI',
        status: 'OPEN',
        oracle
      }
    });
    
    console.log('   ✅ Market created in database! ID:', market.id);
    
  } catch (error) {
    console.error('   ✗ Market creation failed:', error.message);
    if (error.reason) console.error('   Reason:', error.reason);
    if (error.code) console.error('   Code:', error.code);
  }
  
  console.log('\n✅ Test complete!');
  await prisma.$disconnect();
}

testMarketCreation().catch(console.error);

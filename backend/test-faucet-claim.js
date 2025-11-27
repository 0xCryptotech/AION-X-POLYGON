const { ethers } = require('ethers');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const FAUCET_ADDRESS = '0x765622d95D072c00209Cd87e60EfCf472bDF423D';
const AION_TOKEN_ADDRESS = '0x1Ef64Ab093620c73DC656f57D0f7A7061586f331';

const FAUCET_ABI = [
  "function claim() external",
  "function lastClaimTime(address) view returns (uint256)",
  "function claimAmount() view returns (uint256)",
  "function cooldownTime() view returns (uint256)",
  "event Claimed(address indexed user, uint256 amount)"
];

const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

async function testFaucet() {
  console.log('🧪 Testing AION Faucet\n');
  
  const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
  const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
  
  console.log('Wallet:', wallet.address);
  console.log('Faucet:', FAUCET_ADDRESS);
  console.log('Token:', AION_TOKEN_ADDRESS);
  console.log('');
  
  const faucet = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, wallet);
  const token = new ethers.Contract(AION_TOKEN_ADDRESS, TOKEN_ABI, provider);
  
  try {
    // Check faucet config
    console.log('1️⃣ Faucet Configuration:');
    const claimAmount = await faucet.claimAmount();
    const cooldown = await faucet.cooldownTime();
    console.log('   Claim amount:', ethers.utils.formatEther(claimAmount), 'AION');
    console.log('   Cooldown:', cooldown.toNumber() / 3600, 'hours');
    console.log('');
    
    // Check last claim time
    console.log('2️⃣ Claim Status:');
    const lastClaim = await faucet.lastClaimTime(wallet.address);
    const now = Math.floor(Date.now() / 1000);
    const nextClaim = lastClaim.toNumber() + cooldown.toNumber();
    const canClaim = now >= nextClaim;
    
    console.log('   Last claim:', lastClaim.toNumber() === 0 ? 'Never' : new Date(lastClaim.toNumber() * 1000).toLocaleString());
    console.log('   Next claim:', nextClaim === 0 ? 'Now' : new Date(nextClaim * 1000).toLocaleString());
    console.log('   Can claim:', canClaim ? '✅ Yes' : '❌ No');
    console.log('');
    
    // Check balance before
    console.log('3️⃣ Token Balance:');
    const balanceBefore = await token.balanceOf(wallet.address);
    console.log('   Before:', ethers.utils.formatEther(balanceBefore), 'AION');
    console.log('');
    
    if (!canClaim) {
      const waitTime = nextClaim - now;
      const hours = Math.floor(waitTime / 3600);
      const minutes = Math.floor((waitTime % 3600) / 60);
      console.log(`⏰ Need to wait ${hours}h ${minutes}m before next claim`);
      return;
    }
    
    // Try to claim
    console.log('4️⃣ Claiming AION...');
    const tx = await faucet.claim({
      gasLimit: 200000,
      maxFeePerGas: ethers.utils.parseUnits('30', 'gwei'),
      maxPriorityFeePerGas: ethers.utils.parseUnits('30', 'gwei')
    });
    console.log('   Tx hash:', tx.hash);
    console.log('   Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('   ✅ Confirmed in block:', receipt.blockNumber);
    console.log('   ⛽ Gas used:', receipt.gasUsed.toString());
    console.log('');
    
    // Check balance after
    const balanceAfter = await token.balanceOf(wallet.address);
    console.log('5️⃣ Balance After:');
    console.log('   After:', ethers.utils.formatEther(balanceAfter), 'AION');
    console.log('   Received:', ethers.utils.formatEther(balanceAfter.sub(balanceBefore)), 'AION');
    console.log('');
    
    console.log('✅ Faucet claim successful!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.reason) console.error('   Reason:', error.reason);
    if (error.code) console.error('   Code:', error.code);
  }
}

testFaucet();

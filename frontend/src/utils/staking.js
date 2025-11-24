import { ethers } from 'ethers';

const STAKING_ADDRESS = import.meta.env.VITE_STAKING_ADDRESS || '';
const AION_TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS || '';

const STAKING_ABI = [
  "function stake(uint256 amount) external",
  "function unstake(uint256 stakeIndex) external",
  "function getUserStakes(address user) external view returns (tuple(uint256 amount, uint256 startTime, uint256 shares, bool active)[])",
  "function calculateUserValue(address user, uint256 stakeIndex) external view returns (uint256)",
  "function totalStaked() external view returns (uint256)",
  "function revenuePool() external view returns (uint256)",
  "function getCurrentAPY() external view returns (uint256)"
];

export async function getStakingContract() {
  if (!window.ethereum) throw new Error("No wallet found");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, signer);
}

export async function getAIONContract() {
  if (!window.ethereum) throw new Error("No wallet found");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const AIONTokenABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) public view returns (uint256)"
  ];
  return new ethers.Contract(AION_TOKEN_ADDRESS, AIONTokenABI, signer);
}

export async function stakeAION(amount) {
  const staking = await getStakingContract();
  const aion = await getAIONContract();
  
  const amountWei = ethers.utils.parseEther(amount.toString());
  
  const approveTx = await aion.approve(STAKING_ADDRESS, amountWei, { gasLimit: 100000 });
  await approveTx.wait();
  
  const stakeTx = await staking.stake(amountWei, { gasLimit: 300000 });
  await stakeTx.wait();
}

export async function unstakeAION(stakeIndex) {
  const staking = await getStakingContract();
  const tx = await staking.unstake(stakeIndex, { gasLimit: 300000 });
  await tx.wait();
}

export async function getUserStakes(address) {
  const staking = await getStakingContract();
  const stakes = await staking.getUserStakes(address);
  
  return stakes.map(stake => ({
    amount: ethers.utils.formatEther(stake.amount),
    startTime: stake.startTime.toNumber(),
    shares: stake.shares.toString(),
    active: stake.active
  }));
}

export async function getStakingStats() {
  const staking = await getStakingContract();
  
  const totalStaked = await staking.totalStaked();
  const revenuePool = await staking.revenuePool();
  const currentAPY = await staking.getCurrentAPY();
  
  return {
    totalStaked: ethers.utils.formatEther(totalStaked),
    revenuePool: ethers.utils.formatEther(revenuePool),
    estimatedAPY: currentAPY.toNumber() / 100 // Convert from basis points
  };
}

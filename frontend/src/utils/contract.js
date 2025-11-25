import { ethers } from 'ethers';
import PredictionMarketABI from '../../abi/PredictionMarket.json';
import AIONTokenABI from '../../abi/AIONToken.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '';
const AION_TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS || '';

export const getContract = (signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketABI.abi, signer);
};

export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  return provider.getSigner();
};

export const createMarket = async (title, outcomes, closeTime, oracle, mode) => {
  try {
    const signer = await getSigner();
    const contract = getContract(signer);
    const tx = await contract.createMarket(title, outcomes, closeTime, oracle, mode);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Create market error:', error);
    throw error;
  }
};

export const placeBet = async (marketId, outcome, amount) => {
  try {
    const signer = await getSigner();
    const tokenContract = new ethers.Contract(AION_TOKEN_ADDRESS, AIONTokenABI.abi, signer);
    const contract = getContract(signer);
    
    const amountWei = ethers.utils.parseEther(amount.toString());
    
    // Check balance first
    const balance = await tokenContract.balanceOf(await signer.getAddress());
    if (balance.lt(amountWei)) {
      throw new Error(`Insufficient AION balance. Need ${amount} AION, have ${ethers.utils.formatEther(balance)} AION`);
    }
    
    // Approve AION token first
    const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, amountWei, { gasLimit: 100000 });
    await approveTx.wait();
    
    // Place bet
    const tx = await contract.placeBet(marketId, outcome, amountWei, { gasLimit: 300000 });
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Place bet error:', error);
    throw error;
  }
};

export const getMarket = async (marketId) => {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketABI.abi, provider);
    const market = await contract.markets(marketId);
    return market;
  } catch (error) {
    console.error('Get market error:', error);
    throw error;
  }
};

export const withdrawClaim = async () => {
  try {
    const signer = await getSigner();
    const contract = getContract(signer);
    const tx = await contract.withdrawClaim();
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Withdraw claim error:', error);
    throw error;
  }
};

export const getClaimable = async (address) => {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketABI.abi, provider);
    const claimable = await contract.claimable(address);
    return ethers.utils.formatEther(claimable);
  } catch (error) {
    console.error('Get claimable error:', error);
    throw error;
  }
};

export const getAIONBalance = async (address) => {
  try {
    const provider = getProvider();
    const tokenContract = new ethers.Contract(AION_TOKEN_ADDRESS, AIONTokenABI.abi, provider);
    const balance = await tokenContract.balanceOf(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Get AION balance error:', error);
    return '0';
  }
};

export const getBattleHistory = async (userAddress) => {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketABI.abi, provider);
    const marketCount = await contract.marketCount();
    const history = [];
    
    // Only check recent 100 markets for performance
    const startMarket = Math.max(1, marketCount.toNumber() - 100);

    for (let marketId = startMarket; marketId <= marketCount.toNumber(); marketId++) {
      const betsCount = await contract.getMarketBetsCount(marketId);
      for (let i = 0; i < betsCount.toNumber(); i++) {
        const bet = await contract.bets(marketId, i);
        if (bet.bettor.toLowerCase() === userAddress.toLowerCase()) {
          const market = await contract.markets(marketId);
          const isResolved = market.status === 2;
          const isWinner = isResolved && bet.outcome === market.winningOutcome.toNumber();
          
          history.push({
            marketId,
            title: market.title,
            mode: market.mode,
            outcome: bet.outcome,
            amount: ethers.utils.formatEther(bet.amount),
            status: market.status,
            isResolved,
            isWinner,
            timestamp: market.closeTime.toNumber()
          });
        }
      }
    }
    return history.reverse();
  } catch (error) {
    console.error('Get battle history error:', error);
    return [];
  }
};

export const getOpenMarkets = async () => {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketABI.abi, provider);
    const marketCount = await contract.marketCount();
    const openMarkets = [];
    const now = Math.floor(Date.now() / 1000);
    
    // Check last 100 markets for performance
    const startMarket = Math.max(1, marketCount.toNumber() - 100);
    
    for (let i = startMarket; i <= marketCount.toNumber(); i++) {
      const market = await contract.markets(i);
      // Status 0 = OPEN, closeTime > now
      if (market.status === 0 && market.closeTime.toNumber() > now) {
        openMarkets.push({
          id: i,
          title: market.title,
          closeTime: market.closeTime.toNumber(),
          mode: market.mode,
          totalStaked: ethers.utils.formatEther(market.totalStaked)
        });
      }
    }
    return openMarkets;
  } catch (error) {
    console.error('Get open markets error:', error);
    return [];
  }
};

export { CONTRACT_ADDRESS, AION_TOKEN_ADDRESS };

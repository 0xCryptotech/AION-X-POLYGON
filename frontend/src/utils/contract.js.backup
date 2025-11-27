import { ethers } from 'ethers';
import PredictionMarketABI from '../abi/PredictionMarket.json';
import AIONTokenABI from '../abi/AIONToken.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x2C3B12e01313A8336179c5c850d64335137FAbab';
const AION_TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS || '0x1Ef64Ab093620c73DC656f57D0f7A7061586f331';

export const getContract = (signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketABI.abi, signer);
};

export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

// Get a reliable provider for read-only operations with fallback
export const getReadOnlyProvider = () => {
  // Try primary RPC first, then fallback
  const primaryRpc = import.meta.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology/';
  const fallbackRpc = import.meta.env.VITE_FALLBACK_RPC || 'https://polygon-amoy.g.alchemy.com/v2/TnBudoktgrSgm-wy0RkEg';
  
  try {
    return new ethers.providers.JsonRpcProvider(primaryRpc);
  } catch (error) {
    console.warn('[getReadOnlyProvider] Primary RPC failed, using fallback');
    return new ethers.providers.JsonRpcProvider(fallbackRpc);
  }
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

export const placeBet = async (marketId, outcome, amount, onProgress) => {
  try {
    console.log('[placeBet] Starting place bet...');
    onProgress?.('Connecting to wallet...');
    
    const signer = await getSigner();
    if (!signer) throw new Error('Please connect your wallet');
    
    const provider = getProvider();
    const network = await provider.getNetwork();
    const expectedChainId = parseInt(import.meta.env.VITE_CHAIN_ID || '80002');
    
    console.log('[placeBet] Current network:', network.chainId);
    console.log('[placeBet] Expected network:', expectedChainId);
    
    // Validate network
    if (network.chainId !== expectedChainId) {
      throw new Error(`Wrong network! Please switch to Polygon Amoy Testnet (Chain ID: ${expectedChainId})`);
    }
    
    const userAddress = await signer.getAddress();
    console.log('[placeBet] User address:', userAddress);
    
    const amountWei = ethers.utils.parseEther(amount.toString());
    console.log('[placeBet] Amount:', amount, 'AION');
    
    // Optional: Try to check balance, but don't fail if it doesn't work
    // MetaMask will reject the transaction if balance is insufficient anyway
    console.log('[placeBet] Attempting balance check...');
    onProgress?.('Preparing transaction...');
    
    try {
      const tokenContract = new ethers.Contract(AION_TOKEN_ADDRESS, AIONTokenABI.abi, signer);
      const balance = await tokenContract.balanceOf(userAddress);
      console.log('[placeBet] Balance:', ethers.utils.formatEther(balance), 'AION');
      
      if (balance.lt(amountWei)) {
        throw new Error(`Insufficient AION balance. Need ${amount} AION, have ${ethers.utils.formatEther(balance)} AION`);
      }
      console.log('[placeBet] Balance check passed');
    } catch (balanceError) {
      console.warn('[placeBet] Balance check failed, proceeding anyway. MetaMask will validate.', balanceError.message);
      // Don't throw - let the transaction attempt proceed
      // MetaMask will show error if balance is insufficient
    }
    
    // Now use signer for transactions
    const tokenContract = new ethers.Contract(AION_TOKEN_ADDRESS, AIONTokenABI.abi, signer);
    const contract = getContract(signer);
    
    // Get current gas price and add 20% buffer for faster confirmation
    const gasPrice = await provider.getGasPrice();
    const boostedGasPrice = gasPrice.mul(120).div(100); // 20% boost
    console.log('[placeBet] Gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');
    console.log('[placeBet] Boosted gas price:', ethers.utils.formatUnits(boostedGasPrice, 'gwei'), 'gwei');
    
    // Approve AION token first with boosted gas
    console.log('[placeBet] Approving AION token...');
    onProgress?.('Approving AION token... (1/2)');
    
    const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, amountWei, {
      gasPrice: boostedGasPrice
    });
    console.log('[placeBet] Approve tx sent:', approveTx.hash);
    onProgress?.(`Waiting for approval confirmation... (tx: ${approveTx.hash.slice(0, 10)}...)`);
    
    const approveReceipt = await approveTx.wait(1); // Wait for 1 confirmation
    console.log('[placeBet] Approve confirmed in block:', approveReceipt.blockNumber);
    
    // Place bet with boosted gas
    console.log('[placeBet] Placing bet on market', marketId, 'outcome', outcome);
    onProgress?.('Placing bet... (2/2)');
    
    const tx = await contract.placeBet(marketId, outcome, amountWei, {
      gasPrice: boostedGasPrice
    });
    console.log('[placeBet] Bet tx sent:', tx.hash);
    onProgress?.(`Waiting for bet confirmation... (tx: ${tx.hash.slice(0, 10)}...)`);
    
    const receipt = await tx.wait(1); // Wait for 1 confirmation
    console.log('[placeBet] Bet confirmed in block:', receipt.blockNumber);
    onProgress?.('Bet confirmed! ✅');
    
    return tx;
  } catch (error) {
    console.error('Place bet error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error data:', error.data);
    
    // Handle user rejection
    if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
      throw new Error('Transaction rejected by user');
    }
    
    // Handle insufficient funds
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient MATIC for gas fees. Please get MATIC from faucet.');
    }
    
    // Handle CALL_EXCEPTION (wrong network or contract not found)
    if (error.code === 'CALL_EXCEPTION') {
      throw new Error('Contract call failed. Please ensure you are on Polygon Amoy Testnet (Chain ID: 80002) and have AION tokens.');
    }
    
    // Handle network errors
    if (error.message && error.message.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Throw user-friendly error message
    if (error.message && !error.message.includes('call revert exception')) {
      throw new Error(error.message);
    } else if (error.reason) {
      throw new Error(error.reason);
    } else {
      throw new Error('Failed to place bet. Please ensure you have enough AION tokens and MATIC for gas.');
    }
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
    if (!address) {
      console.warn('[getClaimable] No address provided');
      return '0';
    }
    
    const provider = getProvider();
    if (!provider) {
      console.error('[getClaimable] No provider available');
      return '0';
    }
    
    console.log('[getClaimable] Fetching claimable for:', address);
    console.log('[getClaimable] Contract address:', CONTRACT_ADDRESS);
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketABI.abi, provider);
    const claimable = await contract.claimable(address);
    const formatted = ethers.utils.formatEther(claimable);
    
    console.log('[getClaimable] Claimable amount:', formatted, 'AION');
    return formatted;
  } catch (error) {
    console.error('[getClaimable] Error:', error.message);
    console.error('[getClaimable] Full error:', error);
    return '0';
  }
};

export const getAIONBalance = async (address) => {
  try {
    if (!address) {
      console.warn('[getAIONBalance] No address provided');
      return '0';
    }
    
    console.log('[getAIONBalance] Fetching balance for:', address);
    console.log('[getAIONBalance] Token address:', AION_TOKEN_ADDRESS);
    
    // Try with signer's provider first (uses user's connected network)
    try {
      const provider = getProvider();
      if (provider) {
        const tokenContract = new ethers.Contract(AION_TOKEN_ADDRESS, AIONTokenABI.abi, provider);
        const balance = await tokenContract.balanceOf(address);
        const formatted = ethers.utils.formatEther(balance);
        console.log('[getAIONBalance] Balance:', formatted, 'AION');
        return formatted;
      }
    } catch (providerError) {
      console.warn('[getAIONBalance] Provider check failed, trying read-only');
    }
    
    // Fallback to read-only provider
    const readOnlyProvider = getReadOnlyProvider();
    const tokenContract = new ethers.Contract(AION_TOKEN_ADDRESS, AIONTokenABI.abi, readOnlyProvider);
    const balance = await tokenContract.balanceOf(address);
    const formatted = ethers.utils.formatEther(balance);
    
    console.log('[getAIONBalance] Balance (read-only):', formatted, 'AION');
    return formatted;
  } catch (error) {
    console.error('[getAIONBalance] Error:', error.message);
    console.error('[getAIONBalance] This usually means wrong network or contract not deployed');
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
    // Try fetching from backend API first
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://api.aion-x.xyz';
    if (backendUrl) {
      try {
        console.log('[getOpenMarkets] Fetching from backend:', backendUrl);
        const response = await fetch(`${backendUrl}/api/markets`);
        if (response.ok) {
          const markets = await response.json();
          const now = Math.floor(Date.now() / 1000);
          const openMarkets = markets
            .filter(m => m.status === 'OPEN' && new Date(m.closeTime).getTime() / 1000 > now)
            .map(m => ({
              id: m.id,
              title: m.title,
              closeTime: Math.floor(new Date(m.closeTime).getTime() / 1000),
              mode: m.mode === 'AI_VS_AI' ? 0 : m.mode === 'AI_VS_HUMAN' ? 1 : 2,
              totalStaked: '0'
            }));
          console.log('[getOpenMarkets] Found', openMarkets.length, 'markets from backend');
          if (openMarkets.length > 0) return openMarkets;
        }
      } catch (backendError) {
        console.warn('[getOpenMarkets] Backend fetch failed, trying blockchain:', backendError.message);
      }
    }

    // Fallback to blockchain
    const provider = getProvider();
    if (!provider) {
      console.warn('[getOpenMarkets] No provider available');
      return [];
    }

    // Check if we're on the correct network
    const network = await provider.getNetwork();
    const expectedChainId = parseInt(import.meta.env.VITE_CHAIN_ID || '80002');
    
    if (network.chainId !== expectedChainId) {
      console.error(`[getOpenMarkets] Wrong network! Connected to ${network.chainId}, expected ${expectedChainId} (Polygon Amoy)`);
      console.error('[getOpenMarkets] Please switch to Polygon Amoy Testnet in your wallet');
      return [];
    }

    console.log('[getOpenMarkets] Fetching from contract:', CONTRACT_ADDRESS);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketABI.abi, provider);
    const marketCount = await contract.marketCount();
    console.log('[getOpenMarkets] Total markets:', marketCount.toNumber());
    
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
    console.log('[getOpenMarkets] Found', openMarkets.length, 'open markets');
    return openMarkets;
  } catch (error) {
    console.error('[getOpenMarkets] Error:', error.message);
    if (error.code === 'CALL_EXCEPTION') {
      console.error('[getOpenMarkets] Contract call failed. Possible reasons:');
      console.error('  1. Wrong network - Please switch to Polygon Amoy Testnet');
      console.error('  2. Contract not deployed at address:', CONTRACT_ADDRESS);
      console.error('  3. RPC endpoint issue');
    }
    return [];
  }
};

export { CONTRACT_ADDRESS, AION_TOKEN_ADDRESS };

import { useState } from 'react';
import { placeBet, getClaimable, withdrawClaim } from '../utils/contract';
import { toast } from 'sonner';

export const useContract = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handlePlaceBet = async (marketId, outcome, amount) => {
    setLoading(true);
    let toastId;
    
    try {
      // Show initial toast
      toastId = toast.loading('Preparing transaction...');
      
      const tx = await placeBet(marketId, outcome, amount, (progress) => {
        setLoadingMessage(progress);
        toast.loading(progress, { id: toastId });
      });
      
      toast.success('Bet placed successfully! 🎉', { id: toastId });
      setLoadingMessage('');
      return tx;
    } catch (error) {
      console.error('Place bet error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        reason: error.reason,
        data: error.data
      });
      
      const errorMsg = error.message || error.reason || 'Failed to place bet';
      
      if (toastId) {
        toast.error(errorMsg, { id: toastId });
      } else {
        toast.error(errorMsg);
      }
      
      setLoadingMessage('');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      const tx = await withdrawClaim();
      toast.success('Withdrawal successful!');
      return tx;
    } catch (error) {
      console.error('Withdraw error:', error);
      toast.error(error.message || 'Failed to withdraw');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkClaimable = async (address) => {
    try {
      const amount = await getClaimable(address);
      return amount;
    } catch (error) {
      console.error('Check claimable error:', error);
      return '0';
    }
  };

  return {
    loading,
    loadingMessage,
    handlePlaceBet,
    handleWithdraw,
    checkClaimable,
  };
};

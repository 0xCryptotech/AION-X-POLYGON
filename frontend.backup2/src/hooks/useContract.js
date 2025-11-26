import { useState } from 'react';
import { placeBet, getClaimable, withdrawClaim } from '../utils/contract';
import { toast } from 'sonner';

export const useContract = () => {
  const [loading, setLoading] = useState(false);

  const handlePlaceBet = async (marketId, outcome, amount) => {
    setLoading(true);
    try {
      const tx = await placeBet(marketId, outcome, amount);
      toast.success('Bet placed successfully!');
      return tx;
    } catch (error) {
      console.error('Place bet error:', error);
      toast.error(error.message || 'Failed to place bet');
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
    handlePlaceBet,
    handleWithdraw,
    checkClaimable,
  };
};

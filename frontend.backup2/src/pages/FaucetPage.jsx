import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Clock, CheckCircle } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const FAUCET_ADDRESS = process.env.REACT_APP_FAUCET_ADDRESS || '';
const FAUCET_ABI = [
  "function claim() external",
  "function lastClaimTime(address) view returns (uint256)",
  "function claimAmount() view returns (uint256)",
  "function cooldownTime() view returns (uint256)"
];

export const FaucetPage = () => {
  const { isConnected, address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [lastClaim, setLastClaim] = useState(0);
  const [canClaim, setCanClaim] = useState(true);

  const checkClaimStatus = async () => {
    if (!isConnected || !address) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, provider);
      const lastTime = await contract.lastClaimTime(address);
      const cooldown = await contract.cooldownTime();
      const nextClaim = lastTime.toNumber() + cooldown.toNumber();
      const now = Math.floor(Date.now() / 1000);
      setLastClaim(nextClaim);
      setCanClaim(now >= nextClaim);
    } catch (error) {
      console.error('Check claim error:', error);
    }
  };

  const handleClaim = async () => {
    if (!isConnected) {
      toast.error('Please connect wallet first');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);
      const tx = await contract.claim();
      toast.info('Transaction submitted...');
      await tx.wait();
      toast.success('Successfully claimed 100 AION! 🎉');
      
      // Auto add token to wallet
      try {
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: process.env.REACT_APP_TOKEN_ADDRESS || '',
              symbol: 'AION',
              decimals: 18,
            },
          },
        });
      } catch (e) {}
      
      checkClaimStatus();
    } catch (error) {
      console.error('Claim error:', error);
      if (error.message.includes('Cooldown active')) {
        toast.error('Please wait 24 hours between claims');
      } else {
        toast.error('Failed to claim AION');
      }
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    checkClaimStatus();
  }, [isConnected, address]);

  const timeUntilClaim = () => {
    if (canClaim) return 'Ready to claim!';
    const now = Math.floor(Date.now() / 1000);
    const diff = lastClaim - now;
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative text-center mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-3xl animate-pulse" />
          <div className="relative">
            <div className="flex items-center justify-center mb-6">
              <div className="relative animate-bounce">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-3xl opacity-75 animate-pulse" />
                <Coins className="relative h-20 w-20 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black ml-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-pulse">
                AION FAUCET
              </h1>
            </div>
            <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-6">
              💰 Get Free AION Tokens • Claim Every 24 Hours 💰
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-center">
                  Claim Your Free AION
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-xl p-8 text-center">
                  <div className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    100 AION
                  </div>
                  <div className="text-slate-400">Per Claim</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-4 text-center">
                    <Clock className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-xs text-slate-400 mb-1">Cooldown</div>
                    <div className="text-lg font-bold text-cyan-400">24 Hours</div>
                  </div>
                  <div className="bg-slate-900/50 border border-blue-500/30 rounded-lg p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-xs text-slate-400 mb-1">Status</div>
                    <div className="text-lg font-bold text-blue-400">
                      {canClaim ? 'Ready' : timeUntilClaim()}
                    </div>
                  </div>
                </div>

                {!isConnected ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400 mb-4">Connect your wallet to claim AION tokens</p>
                  </div>
                ) : (
                  <Button
                    onClick={handleClaim}
                    disabled={loading || !canClaim}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-6 text-xl rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      'Claiming...'
                    ) : canClaim ? (
                      <>
                        <Coins className="mr-2 h-6 w-6" />
                        Claim 100 AION
                      </>
                    ) : (
                      `Wait ${timeUntilClaim()}`
                    )}
                  </Button>
                )}

                <Button
                  onClick={async () => {
                    try {
                      await window.ethereum.request({
                        method: 'wallet_watchAsset',
                        params: {
                          type: 'ERC20',
                          options: {
                            address: process.env.REACT_APP_TOKEN_ADDRESS || '',
                            symbol: 'AION',
                            decimals: 18,
                            image: 'https://via.placeholder.com/64',
                          },
                        },
                      });
                      toast.success('AION token added to wallet!');
                    } catch (error) {
                      toast.error('Failed to add token');
                    }
                  }}
                  variant="outline"
                  className="w-full border-purple-500/30 hover:bg-purple-500/10 mb-4"
                >
                  ➕ Add AION to Wallet
                </Button>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="font-bold text-blue-300 mb-2">📋 How it works:</h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Connect your wallet</li>
                    <li>• Click "Add AION to Wallet" (optional)</li>
                    <li>• Click "Claim 100 AION" button</li>
                    <li>• Confirm transaction in MetaMask</li>
                    <li>• Receive 100 AION tokens instantly</li>
                    <li>• Come back in 24 hours to claim again</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

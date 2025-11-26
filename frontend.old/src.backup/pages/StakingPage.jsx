import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Coins, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '@/context/WalletContext';

export const StakingPage = () => {
  const { isConnected, address } = useWallet();
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AION Staking
          </h1>
          <p className="text-muted-foreground mb-2">
            Stake AION to earn a share of protocol revenue
          </p>
          <p className="text-sm text-slate-400 mb-8">
            Stakers receive a share of protocol revenue. Estimated APY depends on volume & fees.
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="glass border-cyan-500/50 bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-cyan-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-cyan-400 mb-2">How Staking Works</h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Stake AION to receive shares of the staking pool</li>
                    <li>• Earn 2% of all battle fees proportional to your stake</li>
                    <li>• Returns vary based on platform activity and total staked</li>
                    <li>• Minimum stake: 100 AION | Lock period: 7 days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Staked</span>
                <Coins className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold">10,000 AION</div>
              <div className="text-xs text-slate-400 mt-1">Across all stakers</div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">24h Revenue</span>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400">100 AION</div>
              <div className="text-xs text-slate-400 mt-1">From battle fees (2%)</div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Estimated APY</span>
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-400">~365%</div>
              <div className="text-xs text-slate-400 mt-1">Variable, not guaranteed</div>
            </CardContent>
          </Card>
        </div>

        {/* Stake Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass border-2 border-cyan-500/50 mb-8">
            <CardHeader>
              <CardTitle>Stake AION</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Amount (AION)</label>
                  <input
                    type="number"
                    className="w-full p-3 rounded-md bg-slate-900 border border-slate-700"
                    placeholder="Min: 100 AION"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-900 rounded-md">
                    <div className="text-muted-foreground mb-1">Your Pool Share</div>
                    <div className="text-lg font-bold text-cyan-400">
                      {stakeAmount ? ((parseFloat(stakeAmount) / 10000) * 100).toFixed(2) : '0'}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-md">
                    <div className="text-muted-foreground mb-1">Unlock Date</div>
                    <div className="text-lg font-bold text-purple-400">
                      {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div className="text-xs text-yellow-200">
                      <strong>Risk Disclosure:</strong> Returns are variable and depend on platform activity. 
                      Estimated APY is not guaranteed and may increase or decrease. Smart contract risk exists.
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {}}
                  disabled={loading || !isConnected || !stakeAmount || parseFloat(stakeAmount) < 100}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-6 text-lg"
                >
                  {loading ? 'Processing...' : `Stake ${stakeAmount || '0'} AION`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Explanation */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-md">
                <span className="text-muted-foreground">Battle Volume (24h)</span>
                <span className="font-bold">5,000 AION</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-md">
                <span className="text-muted-foreground">Platform Fee (2%)</span>
                <span className="font-bold text-green-400">100 AION</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-md">
                <span className="text-muted-foreground">Distributed to Stakers</span>
                <span className="font-bold text-cyan-400">100 AION</span>
              </div>
              <div className="text-xs text-slate-400 mt-4">
                * Revenue is distributed proportionally based on your share of the total staking pool.
                Higher platform activity = higher returns for stakers.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Not Connected */}
        {!isConnected && (
          <Card className="glass border-border/50 mt-8">
            <CardContent className="py-20 text-center">
              <p className="text-muted-foreground text-lg">Connect your wallet to start staking</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

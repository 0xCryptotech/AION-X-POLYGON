import { TrendingUp, TrendingDown, Clock, ArrowRight, User, Wallet, Trophy, Target, Edit2, Camera, DollarSign, Coins, Swords, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { mockPortfolio } from '@/data/mockData';
import { formatBNB, formatTimeRemaining } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useContract } from '@/hooks/useContract';
import { getClaimable, getAIONBalance, getBattleHistory } from '@/utils/contract';
import { useNavigate } from 'react-router-dom';

export const PortfolioPage = () => {
  const { isConnected, address } = useWallet();
  const navigate = useNavigate();
  const { handleWithdraw, loading } = useContract();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('User Profile');
  const [userBio, setUserBio] = useState('Track your betting performance and active positions');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [claimableAmount, setClaimableAmount] = useState('0');
  const [aionBalance, setAionBalance] = useState('0');
  const [battleHistory, setBattleHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const fileInputRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  const refreshData = async () => {
    if (isConnected && address) {
      console.log('[Portfolio] Fetching data for address:', address);
      const [claimable, balance, history] = await Promise.all([
        getClaimable(address),
        getAIONBalance(address),
        getBattleHistory(address)
      ]);
      console.log('[Portfolio] AION Balance:', balance);
      console.log('[Portfolio] Claimable:', claimable);
      setClaimableAmount(claimable);
      setAionBalance(balance);
      setBattleHistory(history);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      setLoadingHistory(true);
      refreshData().finally(() => setLoadingHistory(false));
      
      // Auto-refresh every 5 seconds
      refreshIntervalRef.current = setInterval(refreshData, 5000);
      
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [isConnected, address]);

  const handleWithdrawClick = async () => {
    try {
      await handleWithdraw();
      await refreshData();
    } catch (error) {
      console.error('Withdraw error:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const stats = [
    {
      label: 'Total Invested',
      value: `${formatBNB(mockPortfolio.totalInvested)} MATIC`,
      icon: TrendingDown,
      color: 'text-primary',
    },
    {
      label: 'Total Earnings',
      value: `${formatBNB(mockPortfolio.totalEarnings)} MATIC`,
      icon: TrendingUp,
      color: 'text-accent',
    },
    {
      label: 'Profit/Loss',
      value: `${mockPortfolio.profitLoss >= 0 ? '+' : ''}${formatBNB(mockPortfolio.profitLoss)} MATIC`,
      icon: mockPortfolio.profitLoss >= 0 ? TrendingUp : TrendingDown,
      color: mockPortfolio.profitLoss >= 0 ? 'text-success' : 'text-destructive',
    },
    {
      label: 'Win Rate',
      value: `${mockPortfolio.winRate}%`,
      icon: TrendingUp,
      color: 'text-secondary',
    },
  ];

  const betStats = [
    { label: 'Total Bets', value: mockPortfolio.totalBets, color: 'bg-primary' },
    { label: 'Active', value: mockPortfolio.activeBets, color: 'bg-accent' },
    { label: 'Won', value: mockPortfolio.wonBets, color: 'bg-success' },
    { label: 'Lost', value: mockPortfolio.lostBets, color: 'bg-destructive' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass border-border/50 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border-2 border-purple-500/30">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 blur-xl opacity-50" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 rounded-full p-2 border-2 border-slate-900 transition-colors"
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2 bg-transparent border-b border-cyan-500 outline-none w-full"
                    />
                  ) : (
                    <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">{userName}</h1>
                  )}
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <Wallet className="h-4 w-4 text-cyan-400" />
                    {isConnected && address ? (
                      <span className="font-mono text-sm text-cyan-300">{address.slice(0, 6)}...{address.slice(-4)}</span>
                    ) : (
                      <span className="font-mono text-sm text-slate-400">Not Connected</span>
                    )}
                  </div>
                  {isConnected && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Coins className="h-4 w-4 text-yellow-400" />
                      <span className="font-mono text-sm text-yellow-300">{parseFloat(aionBalance).toFixed(2)} AION</span>
                    </div>
                  )}
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={userBio}
                      onChange={(e) => setUserBio(e.target.value)}
                      className="text-muted-foreground bg-transparent border-b border-slate-600 outline-none w-full"
                    />
                  ) : (
                    <p className="text-muted-foreground">{userBio}</p>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={() => setIsEditing(!isEditing)} 
                    variant="outline" 
                    className="bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {isEditing ? 'Save' : 'Edit Profile'}
                  </Button>
                  <div className="flex gap-4">
                  <div className="text-center bg-slate-900/50 border border-cyan-500/30 rounded-lg px-4 py-3">
                    <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Rank</div>
                    <div className="text-lg font-bold text-white">#42</div>
                  </div>
                  <div className="text-center bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3">
                    <Target className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Level</div>
                    <div className="text-lg font-bold text-white">12</div>
                  </div>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Claimable Rewards */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="glass border-2 border-green-500/50 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-400 mb-2">💰 Claimable Rewards</div>
                    <div className="text-4xl font-bold text-green-400">{parseFloat(claimableAmount || 0).toFixed(2)} AION</div>
                  </div>
                  <Button
                    onClick={handleWithdrawClick}
                    disabled={loading || parseFloat(claimableAmount) === 0}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-6 text-lg"
                  >
                    <DollarSign className="mr-2 h-6 w-6" />
                    {loading ? 'Withdrawing...' : 'Withdraw'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className={`font-mono text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Bet Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-border/50 mb-8">
            <CardHeader>
              <CardTitle>Bet Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {betStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="font-mono font-semibold">{stat.value}</span>
                    </div>
                    <Progress
                      value={(stat.value / mockPortfolio.totalBets) * 100}
                      className={`h-2 [&>div]:${stat.color}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Bets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Active Bets</h2>
          <div className="grid grid-cols-1 gap-4">
            {mockPortfolio.activeBetsDetails.map((bet, index) => (
              <Card key={index} className="glass glass-hover border-border/50 group">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-smooth">
                        {bet.title}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                          {bet.outcome}
                        </Badge>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="font-mono">{formatTimeRemaining(bet.closeTime)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Bet Amount</div>
                        <div className="font-mono text-lg font-semibold">{formatBNB(bet.amount)} MATIC</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Potential Return</div>
                        <div className="font-mono text-lg font-semibold text-accent">
                          {formatBNB(bet.potentialReturn)} MATIC
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="glass border-primary/30 hover:bg-primary/10 group"
                      >
                        View Market
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-smooth" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {mockPortfolio.activeBetsDetails.length === 0 && (
          <Card className="glass border-border/50">
            <CardContent className="py-20 text-center">
              <p className="text-muted-foreground text-lg mb-4">No active bets yet</p>
              <Button onClick={() => navigate('/battle')} className="bg-primary hover:bg-primary/90">🧠⚔️ Enter the Arena</Button>
            </CardContent>
          </Card>
        )}

        {/* Battle History */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Swords className="h-6 w-6 text-cyan-400" />
              Battle History
            </h2>
            {loadingHistory ? (
              <Card className="glass border-border/50">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Loading battle history...</p>
                </CardContent>
              </Card>
            ) : battleHistory.length === 0 ? (
              <Card className="glass border-border/50">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground text-lg mb-4">No battle history yet</p>
                  <Button onClick={() => navigate('/battle')} className="bg-primary hover:bg-primary/90">🧠⚔️ Start Your First Battle</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {battleHistory.map((battle, index) => {
                  const modeLabels = ['AI vs AI', 'AI vs Human', 'Human vs Human'];
                  const outcomeLabels = ['Bullish 🚀', 'Bearish 📉'];
                  const statusLabels = ['Open', 'Closed', 'Resolved'];
                  
                  return (
                    <Card key={index} className={`glass border-2 ${
                      battle.isResolved 
                        ? battle.isWinner 
                          ? 'border-green-500/50 bg-green-900/10' 
                          : 'border-red-500/50 bg-red-900/10'
                        : 'border-border/50'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{battle.title}</h3>
                              {battle.isResolved && (
                                battle.isWinner ? (
                                  <CheckCircle className="h-5 w-5 text-green-400" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-400" />
                                )
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                                {modeLabels[battle.mode]}
                              </Badge>
                              <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-400">
                                {outcomeLabels[battle.outcome]}
                              </Badge>
                              <Badge variant="outline" className={`${
                                battle.status === 2 ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                              }`}>
                                {statusLabels[battle.status]}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center space-x-8">
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Staked</div>
                              <div className="font-mono text-lg font-semibold text-yellow-400">{parseFloat(battle.amount).toFixed(2)} AION</div>
                            </div>
                            {battle.isResolved && (
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Result</div>
                                <div className={`font-mono text-lg font-bold ${
                                  battle.isWinner ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {battle.isWinner ? 'WON 🎉' : 'LOST'}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

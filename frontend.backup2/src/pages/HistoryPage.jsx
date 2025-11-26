import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBattleHistory } from '@/context/BattleHistoryContext';
import { TrendingUp, TrendingDown, Trophy, Target, Zap, Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const HistoryPage = () => {
  const { battles, stats } = useBattleHistory();
  const [filter, setFilter] = useState('all'); // 'all', 'win', 'loss', 'draw'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'ai-vs-ai', 'ai-vs-human', 'human-vs-human'

  const filteredBattles = battles.filter((battle) => {
    const matchResult = filter === 'all' || battle.result === filter;
    const matchType = typeFilter === 'all' || battle.type === typeFilter;
    return matchResult && matchType;
  });

  const statCards = [
    {
      label: 'Total Battles',
      value: stats.totalBattles,
      icon: Zap,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Win Rate',
      value: `${stats.winRate}%`,
      icon: Trophy,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Total Won',
      value: `${stats.totalWon.toFixed(4)} MATIC`,
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Profit/Loss',
      value: `${stats.profitLoss >= 0 ? '+' : ''}${stats.profitLoss.toFixed(4)} MATIC`,
      icon: stats.profitLoss >= 0 ? TrendingUp : TrendingDown,
      color: stats.profitLoss >= 0 ? 'text-green-400' : 'text-red-400',
      bg: stats.profitLoss >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Battle History
          </h1>
          <p className="text-slate-400">Track your performance and analyze your battles</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <Card key={index} className={`glass border-border/50 ${stat.bg}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">{stat.label}</span>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className={`font-mono text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Result</p>
                  <div className="flex gap-2">
                    {['all', 'win', 'loss', 'draw'].map((f) => (
                      <Button
                        key={f}
                        onClick={() => setFilter(f)}
                        variant={filter === f ? 'default' : 'outline'}
                        size="sm"
                        className={filter === f ? 'bg-cyan-500' : ''}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Battle Type</p>
                  <div className="flex gap-2">
                    {['all', 'ai-vs-ai', 'ai-vs-human', 'human-vs-human'].map((f) => (
                      <Button
                        key={f}
                        onClick={() => setTypeFilter(f)}
                        variant={typeFilter === f ? 'default' : 'outline'}
                        size="sm"
                        className={typeFilter === f ? 'bg-purple-500' : ''}
                      >
                        {f === 'all' ? 'All' : f.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Battle List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Battle Records ({filteredBattles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredBattles.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No battles found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBattles.map((battle) => (
                    <div
                      key={battle.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        battle.result === 'win'
                          ? 'bg-green-900/20 border-green-500/30'
                          : battle.result === 'loss'
                          ? 'bg-red-900/20 border-red-500/30'
                          : 'bg-slate-900/50 border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                              {battle.type?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </Badge>
                            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
                              {battle.asset}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {new Date(battle.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-slate-300">
                            <span className="font-semibold">Prediction:</span> {battle.prediction} • 
                            <span className="font-semibold ml-2">Outcome:</span> {battle.outcome}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            battle.result === 'win' ? 'text-green-400' : battle.result === 'loss' ? 'text-red-400' : 'text-slate-400'
                          }`}>
                            {battle.result === 'win' ? `+${battle.payout?.toFixed(4)}` : battle.result === 'loss' ? `-${battle.stake?.toFixed(4)}` : '0.0000'} MATIC
                          </div>
                          <div className="text-xs text-slate-400">
                            Stake: {battle.stake?.toFixed(4)} MATIC
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

import { Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockLeaderboard } from '@/data/mockData';
import { formatBNB } from '@/lib/utils';
import { motion } from 'framer-motion';

export const LeaderboardPage = () => {
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1:
        return 'text-accent';
      case 2:
        return 'text-muted-foreground';
      case 3:
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-accent blur-xl opacity-50" />
              <Trophy className="relative h-16 w-16 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Top performers in AION-X prediction markets</p>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Table Header */}
          <div className="glass border-border/50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-muted-foreground">
              <div>Rank</div>
              <div>Address</div>
              <div className="text-right">Total Bets</div>
              <div className="text-right">Win Rate</div>
              <div className="text-right">Earnings</div>
            </div>
          </div>

          {/* Leaderboard Entries */}
          <div className="space-y-3">
            {mockLeaderboard.map((entry, index) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="glass glass-hover border-border/50 group">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-5 gap-4 items-center">
                      {/* Rank */}
                      <div className="flex items-center space-x-3">
                        {entry.rank <= 3 ? (
                          <Trophy className={`h-6 w-6 ${getMedalColor(entry.rank)}`} fill="currentColor" />
                        ) : (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <span className="font-mono text-lg font-bold text-muted-foreground">
                              {entry.rank}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      <div>
                        <span className="font-mono text-sm group-hover:text-primary transition-smooth">
                          {entry.address}
                        </span>
                      </div>

                      {/* Total Bets */}
                      <div className="text-right">
                        <span className="font-mono font-semibold">{entry.totalBets}</span>
                      </div>

                      {/* Win Rate */}
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            entry.winRate >= 65
                              ? 'border-success/30 bg-success/10 text-success'
                              : entry.winRate >= 60
                              ? 'border-primary/30 bg-primary/10 text-primary'
                              : 'border-muted/30 bg-muted/10 text-muted-foreground'
                          }
                        >
                          {entry.winRate}%
                        </Badge>
                      </div>

                      {/* Earnings */}
                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <TrendingUp className="h-4 w-4 text-accent" />
                          <span className="font-mono font-bold text-accent">{formatBNB(entry.totalEarnings)} MATIC</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Current User Rank (Mock) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <Card className="glass border-primary/30 glow-primary">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Your Current Rank</p>
                <div className="flex items-center justify-center space-x-4">
                  <span className="font-mono text-3xl font-bold gradient-text-primary">#142</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    Keep betting to climb the leaderboard!
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

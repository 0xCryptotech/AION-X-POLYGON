import { useState } from 'react';
import { Clock, TrendingUp, Users, Zap, Bot, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatTimeRemaining, formatBNB, calculateOdds } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LivePrice } from '@/components/LivePrice';

export const MarketCard = ({ market, onClick }) => {
  const getModeIcon = (mode) => {
    switch (mode) {
      case 'AI_VS_AI':
        return <Bot className="h-4 w-4" />;
      case 'AI_VS_HUMAN':
        return (
          <div className="flex items-center space-x-1">
            <Bot className="h-3.5 w-3.5" />
            <span className="text-xs">vs</span>
            <User className="h-3.5 w-3.5" />
          </div>
        );
      case 'HUMAN_VS_HUMAN':
        return <User className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'AI_VS_AI':
        return 'border-secondary/30 bg-secondary/10 text-secondary';
      case 'AI_VS_HUMAN':
        return 'border-primary/30 bg-primary/10 text-primary';
      case 'HUMAN_VS_HUMAN':
        return 'border-accent/30 bg-accent/10 text-accent';
      default:
        return 'border-muted/30 bg-muted/10 text-muted-foreground';
    }
  };

  const getModeName = (mode) => {
    return mode.split('_').join(' ');
  };

  const totalPool = market.outcomes.reduce((sum, outcome) => sum + outcome.pool, 0);
  const highestOdds = Math.max(...market.outcomes.map(o => calculateOdds(o.pool, totalPool)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className="glass glass-hover cursor-pointer group border-border/50 overflow-hidden relative"
        onClick={onClick}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-smooth" />

        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between mb-3">
            <Badge variant="outline" className={getModeColor(market.mode)}>
              <span className="flex items-center space-x-1.5">
                {getModeIcon(market.mode)}
                <span className="text-xs font-semibold">{getModeName(market.mode)}</span>
              </span>
            </Badge>
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-mono">{formatTimeRemaining(market.closeTime)}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-smooth line-clamp-2">
            {market.title}
          </h3>
          {market.symbol && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Live Price:</span>
              <LivePrice symbol={market.symbol} showChange={false} showBadge={true} />
            </div>
          )}
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Outcomes */}
          <div className="space-y-2.5">
            {market.outcomes.map((outcome, index) => {
              const odds = calculateOdds(outcome.pool, totalPool);
              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium">{outcome.name}</span>
                    <span className="font-mono font-semibold text-primary">{odds}%</span>
                  </div>
                  <Progress value={parseFloat(odds)} className="h-2" />
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Total Pool</span>
            </div>
            <span className="font-mono font-semibold text-accent">{formatBNB(totalPool)} AION</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs">Participants</span>
            </div>
            <span className="font-mono font-semibold">{market.participants}</span>
          </div>
        </CardContent>

        <CardFooter className="relative pt-4">
          <Button className="w-full bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/30 transition-smooth group-hover:glow-primary">
            Place Bet
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

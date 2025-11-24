import { useState } from 'react';
import { X, TrendingUp, Users, Clock, Bot, User, Zap, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatTimeRemaining, formatBNB, calculateOdds } from '@/lib/utils';
import { toast } from 'sonner';

export const MarketModal = ({ market, open, onClose }) => {
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [betAmount, setBetAmount] = useState('');

  if (!market) return null;

  const totalPool = market.outcomes.reduce((sum, outcome) => sum + outcome.pool, 0);

  const handlePlaceBet = () => {
    if (!selectedOutcome && selectedOutcome !== 0) {
      toast.error('Please select an outcome');
      return;
    }
    if (!betAmount || parseFloat(betAmount) <= 0) {
      toast.error('Please enter a valid bet amount');
      return;
    }

    // Mock bet placement
    toast.success(`Bet placed! ${betAmount} MATIC on "${market.outcomes[selectedOutcome].name}"`);
    setBetAmount('');
    setSelectedOutcome(null);
    onClose();
  };

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-border/50 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-8">{market.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Market Info */}
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className={getModeColor(market.mode)}>
              <span className="flex items-center space-x-1.5">
                {getModeIcon(market.mode)}
                <span className="text-xs font-semibold">{market.mode.split('_').join(' ')}</span>
              </span>
            </Badge>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">{formatTimeRemaining(market.closeTime)}</span>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Total Pool</span>
              </div>
              <div className="font-mono text-2xl font-bold text-accent">{formatBNB(totalPool)} MATIC</div>
            </div>
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Participants</span>
              </div>
              <div className="font-mono text-2xl font-bold">{market.participants}</div>
            </div>
          </div>

          <Tabs defaultValue="bet" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bet">Place Bet</TabsTrigger>
              <TabsTrigger value="info">Market Info</TabsTrigger>
            </TabsList>

            <TabsContent value="bet" className="space-y-4 mt-6">
              {/* Outcome Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Select Outcome</label>
                {market.outcomes.map((outcome, index) => {
                  const odds = calculateOdds(outcome.pool, totalPool);
                  const isSelected = selectedOutcome === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedOutcome(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-smooth ${
                        isSelected
                          ? 'border-primary bg-primary/10 glow-primary'
                          : 'border-border/50 glass glass-hover'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {isSelected && <Check className="h-5 w-5 text-primary" />}
                          <span className="font-semibold">{outcome.name}</span>
                        </div>
                        <span className="font-mono font-bold text-primary text-lg">{odds}%</span>
                      </div>
                      <Progress value={parseFloat(odds)} className="h-2" />
                      <div className="mt-2 text-sm text-muted-foreground">
                        Pool: <span className="font-mono text-accent">{formatBNB(outcome.pool)} MATIC</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bet Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Bet Amount (BNB)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="font-mono text-lg"
                  step="0.01"
                  min="0"
                />
                <div className="flex items-center space-x-2">
                  {['0.1', '0.5', '1', '5'].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setBetAmount(amount)}
                      className="glass"
                    >
                      {amount} MATIC
                    </Button>
                  ))}
                </div>
              </div>

              {/* Potential Return */}
              {betAmount && selectedOutcome !== null && (
                <div className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Potential Return</span>
                    <span className="font-mono text-xl font-bold text-accent">
                      ~{formatBNB((parseFloat(betAmount) * totalPool) / market.outcomes[selectedOutcome].pool)} MATIC
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePlaceBet}
                className="w-full bg-primary hover:bg-primary/90 text-lg h-12 glow-primary"
                disabled={selectedOutcome === null || !betAmount}
              >
                Place Bet
              </Button>
            </TabsContent>

            <TabsContent value="info" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Market Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is a {market.mode.toLowerCase().split('_').join(' ')} prediction market. Place your bets on
                    which outcome you think will win. The market closes at the specified time, and the oracle will
                    resolve the outcome.
                  </p>
                </div>

                <div className="glass p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Market ID</span>
                    <span className="font-mono">{market.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                      Open
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Close Time</span>
                    <span className="font-mono">{new Date(market.closeTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { usePythPrice } from '@/hooks/usePythPrice';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const LivePrice = ({ symbol, showChange = true, showBadge = false }) => {
  const { price, loading } = usePythPrice(symbol);

  if (loading || !price) {
    return <span className="text-muted-foreground animate-pulse">Loading...</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono font-semibold text-green-400">
        ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      {showChange && <TrendingUp className="h-4 w-4 text-green-400" />}
      {showBadge && (
        <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] px-1.5 py-0">
          Pyth Network
        </Badge>
      )}
    </div>
  );
};

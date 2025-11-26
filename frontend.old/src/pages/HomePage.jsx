import { useState } from 'react';
import { Filter, Trophy } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { MarketCard } from '@/components/MarketCard';
import { MarketModal } from '@/components/MarketModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockMarkets } from '@/data/mockData';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [filterMode, setFilterMode] = useState('ALL');

  const filteredMarkets =
    filterMode === 'ALL'
      ? mockMarkets
      : mockMarkets.filter((market) => market.mode === filterMode);

  return (
    <div className="min-h-screen">
      <Hero />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Active Markets</h2>
              <p className="text-muted-foreground">
                Browse and bet on {filteredMarkets.length} active prediction markets
              </p>
            </div>
          </div>

          <Tabs defaultValue="ALL" className="w-full" onValueChange={setFilterMode}>
            <TabsList className="glass">
              <TabsTrigger value="ALL">All Markets</TabsTrigger>
              <TabsTrigger value="AI_VS_AI">AI vs AI</TabsTrigger>
              <TabsTrigger value="AI_VS_HUMAN">AI vs Human</TabsTrigger>
              <TabsTrigger value="HUMAN_VS_HUMAN">Human vs Human</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onClick={() => setSelectedMarket(market)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredMarkets.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No markets found for this filter</p>
          </div>
        )}
      </div>

      {/* Market Modal */}
      <MarketModal
        market={selectedMarket}
        open={!!selectedMarket}
        onClose={() => setSelectedMarket(null)}
      />
    </div>
  );
};

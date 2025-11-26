import { createContext, useContext, useState } from 'react';

const BattleHistoryContext = createContext();

export const useBattleHistory = () => {
  const context = useContext(BattleHistoryContext);
  if (!context) {
    throw new Error('useBattleHistory must be used within BattleHistoryProvider');
  }
  return context;
};

export const BattleHistoryProvider = ({ children }) => {
  const [battles, setBattles] = useState([]);
  const [stats, setStats] = useState({
    totalBattles: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    totalWagered: 0,
    totalWon: 0,
    totalLost: 0,
    winRate: 0,
    profitLoss: 0,
  });

  const addBattle = (battle) => {
    const newBattle = {
      id: Date.now(),
      timestamp: new Date(),
      ...battle,
    };

    setBattles((prev) => [newBattle, ...prev]);
    updateStats(newBattle);
    
    return newBattle.id;
  };

  const updateStats = (battle) => {
    setStats((prev) => {
      const totalBattles = prev.totalBattles + 1;
      const wins = battle.result === 'win' ? prev.wins + 1 : prev.wins;
      const losses = battle.result === 'loss' ? prev.losses + 1 : prev.losses;
      const draws = battle.result === 'draw' ? prev.draws + 1 : prev.draws;
      const totalWagered = prev.totalWagered + (battle.stake || 0);
      const totalWon = battle.result === 'win' ? prev.totalWon + (battle.payout || 0) : prev.totalWon;
      const totalLost = battle.result === 'loss' ? prev.totalLost + (battle.stake || 0) : prev.totalLost;
      const winRate = totalBattles > 0 ? ((wins / totalBattles) * 100).toFixed(2) : 0;
      const profitLoss = totalWon - totalLost;

      return {
        totalBattles,
        wins,
        losses,
        draws,
        totalWagered,
        totalWon,
        totalLost,
        winRate,
        profitLoss,
      };
    });
  };

  const getBattlesByType = (type) => {
    return battles.filter((b) => b.type === type);
  };

  const getBattlesByResult = (result) => {
    return battles.filter((b) => b.result === result);
  };

  const clearHistory = () => {
    setBattles([]);
    setStats({
      totalBattles: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalWagered: 0,
      totalWon: 0,
      totalLost: 0,
      winRate: 0,
      profitLoss: 0,
    });
  };

  return (
    <BattleHistoryContext.Provider
      value={{
        battles,
        stats,
        addBattle,
        getBattlesByType,
        getBattlesByResult,
        clearHistory,
      }}
    >
      {children}
    </BattleHistoryContext.Provider>
  );
};

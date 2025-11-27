import { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

const AchievementContext = createContext();

const ACHIEVEMENTS = [
  { id: 'first_battle', name: 'First Blood', description: 'Complete your first battle', icon: '⚔️', requirement: 1, type: 'battles' },
  { id: 'battle_10', name: 'Warrior', description: 'Complete 10 battles', icon: '🛡️', requirement: 10, type: 'battles' },
  { id: 'battle_50', name: 'Veteran', description: 'Complete 50 battles', icon: '🏅', requirement: 50, type: 'battles' },
  { id: 'battle_100', name: 'Legend', description: 'Complete 100 battles', icon: '👑', requirement: 100, type: 'battles' },
  { id: 'first_win', name: 'Victory', description: 'Win your first battle', icon: '🎯', requirement: 1, type: 'wins' },
  { id: 'win_10', name: 'Champion', description: 'Win 10 battles', icon: '🏆', requirement: 10, type: 'wins' },
  { id: 'win_50', name: 'Master', description: 'Win 50 battles', icon: '💎', requirement: 50, type: 'wins' },
  { id: 'streak_3', name: 'Hot Streak', description: 'Win 3 battles in a row', icon: '🔥', requirement: 3, type: 'streak' },
  { id: 'streak_5', name: 'Unstoppable', description: 'Win 5 battles in a row', icon: '⚡', requirement: 5, type: 'streak' },
  { id: 'profit_1', name: 'Profitable', description: 'Earn 1 BNB profit', icon: '💰', requirement: 1, type: 'profit' },
  { id: 'profit_10', name: 'Whale', description: 'Earn 10 BNB profit', icon: '🐋', requirement: 10, type: 'profit' },
  { id: 'ai_master', name: 'AI Whisperer', description: 'Win 20 AI vs AI battles', icon: '🤖', requirement: 20, type: 'ai_battles' },
  { id: 'human_master', name: 'People Person', description: 'Win 20 Human vs Human battles', icon: '👥', requirement: 20, type: 'human_battles' },
];

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementProvider');
  }
  return context;
};

export const AchievementProvider = ({ children }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [progress, setProgress] = useState({
    battles: 0,
    wins: 0,
    streak: 0,
    maxStreak: 0,
    profit: 0,
    ai_battles: 0,
    human_battles: 0,
  });
  const { addNotification } = useNotifications();

  const checkAchievements = (newProgress) => {
    ACHIEVEMENTS.forEach((achievement) => {
      if (!unlockedAchievements.includes(achievement.id)) {
        const currentValue = newProgress[achievement.type];
        if (currentValue >= achievement.requirement) {
          unlockAchievement(achievement);
        }
      }
    });
  };

  const unlockAchievement = (achievement) => {
    setUnlockedAchievements((prev) => [...prev, achievement.id]);
    addNotification({
      type: 'success',
      title: `🎉 Achievement Unlocked!`,
      message: `${achievement.icon} ${achievement.name}: ${achievement.description}`,
    });
  };

  const updateProgress = (updates) => {
    setProgress((prev) => {
      const newProgress = { ...prev, ...updates };
      checkAchievements(newProgress);
      return newProgress;
    });
  };

  const getAchievementProgress = (achievementId) => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!achievement) return 0;
    const current = progress[achievement.type] || 0;
    return Math.min((current / achievement.requirement) * 100, 100);
  };

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const completionRate = ((unlockedCount / totalCount) * 100).toFixed(0);

  return (
    <AchievementContext.Provider
      value={{
        achievements: ACHIEVEMENTS,
        unlockedAchievements,
        progress,
        updateProgress,
        getAchievementProgress,
        unlockedCount,
        totalCount,
        completionRate,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

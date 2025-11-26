import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAchievements } from '@/context/AchievementContext';
import { Trophy, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const AchievementsPage = () => {
  const { achievements, unlockedAchievements, getAchievementProgress, unlockedCount, totalCount, completionRate } = useAchievements();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                Achievements
              </h1>
              <p className="text-slate-400">Unlock badges and track your progress</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-yellow-400">{unlockedCount}/{totalCount}</div>
              <div className="text-sm text-slate-400">Unlocked</div>
            </div>
          </div>
          
          <Card className="glass border-border/50 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Overall Progress</span>
                <span className="text-lg font-bold text-yellow-400">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-orange-500" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievement Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {achievements.map((achievement, index) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const progress = getAchievementProgress(achievement.id);

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`glass border-2 transition-all hover:scale-105 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/50 shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                      : 'bg-slate-900/50 border-slate-700 opacity-60'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`text-5xl ${isUnlocked ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      {isUnlocked ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <Lock className="h-6 w-6 text-slate-600" />
                      )}
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${isUnlocked ? 'text-yellow-400' : 'text-slate-400'}`}>
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">{achievement.description}</p>

                    {!isUnlocked && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500">Progress</span>
                          <span className="text-xs text-slate-500">{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    {isUnlocked && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                        Unlocked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

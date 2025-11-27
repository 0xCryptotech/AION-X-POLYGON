import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';

export default function BattleResultModal({ isOpen, onClose, result }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && result?.won) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [isOpen, result?.won]);

  if (!isOpen || !result) return null;

  const { won, prediction, outcome, stake, payout, profit, fee, asset } = result;

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className={`relative w-full max-w-md rounded-2xl p-8 ${
            won 
              ? 'bg-gradient-to-br from-green-900/90 to-emerald-900/90 border-4 border-green-500'
              : 'bg-gradient-to-br from-red-900/90 to-rose-900/90 border-4 border-red-500'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center mb-6"
          >
            {won ? (
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-50 animate-pulse" />
                <Trophy className="relative h-24 w-24 text-yellow-400" fill="currentColor" />
              </div>
            ) : (
              <TrendingDown className="h-24 w-24 text-red-400" />
            )}
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-4xl font-black text-center mb-4 ${
              won ? 'text-yellow-400' : 'text-red-400'
            }`}
          >
            {won ? '🎉 CONGRATULATIONS! 🎉' : '😔 BETTER LUCK NEXT TIME'}
          </motion.h2>

          {/* Message */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-white text-lg mb-6"
          >
            {won 
              ? 'You predicted correctly and won the battle!'
              : 'Your prediction was incorrect this time.'}
          </motion.p>

          {/* Battle Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-black/30 rounded-xl p-6 mb-6 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Asset:</span>
              <span className="font-bold text-white">{asset}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Your Prediction:</span>
              <span className={`font-bold flex items-center gap-2 ${
                prediction === 'BULLISH' ? 'text-green-400' : 'text-red-400'
              }`}>
                {prediction === 'BULLISH' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {prediction}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Actual Outcome:</span>
              <span className={`font-bold flex items-center gap-2 ${
                outcome === 'BULLISH' ? 'text-green-400' : 'text-red-400'
              }`}>
                {outcome === 'BULLISH' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {outcome}
              </span>
            </div>

            <div className="border-t border-white/20 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Stake Amount:</span>
                <span className="font-mono text-white">{stake} AION</span>
              </div>

              {won && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Payout:</span>
                    <span className="font-mono text-green-400 font-bold">{payout.toFixed(2)} AION</span>
                  </div>
                  {fee > 0 && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Platform Fee (2%):</span>
                      <span className="font-mono text-slate-400">-{fee.toFixed(2)} AION</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Net Profit:</span>
                    <span className="font-mono text-yellow-400 font-bold text-xl">
                      +{profit.toFixed(2)} AION
                    </span>
                  </div>
                </>
              )}

              {!won && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Result:</span>
                  <span className="font-mono text-yellow-400 font-bold">0 AION</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3"
          >
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/30 hover:bg-white/10"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onClose();
                // Navigate to battle page or start new battle
              }}
              className={`flex-1 font-bold ${
                won
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400'
              }`}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Battle Again
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

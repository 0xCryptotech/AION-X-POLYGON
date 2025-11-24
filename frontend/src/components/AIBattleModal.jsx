import React, { useEffect, useRef, useState } from "react";
import BattleResultModal from '@/components/BattleResultModal';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/context/WalletContext';
import { getMarket, getOpenMarkets } from '@/utils/contract';
import { subscribeToPythPrice } from '@/utils/pythPrice';
import {
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Local Label shim (avoid missing @radix/react-label dependency)
const Label = ({ children, className = "" }) => (
  <label className={`text-sm font-medium ${className}`}>{children}</label>
);

const COINS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];

const AI_MODELS = ["GPT-5 Oracle", "Claude-3", "DeepMind-FX", "Bloom-Alpha"];

// This component can be used as a controlled modal
export default function AIBattleModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return <FullscreenBattleModal onClose={onClose} />;
}

function FullscreenBattleModal({ onClose }) {
  const { handlePlaceBet, loading: contractLoading } = useContract();
  const { isConnected } = useWallet();
  
  // selections
  const [asset, setAsset] = useState(COINS[0]);
  const [timeframe] = useState('M10'); // Fixed 10 minutes
  const [modelA, setModelA] = useState(AI_MODELS[0]);
  const [modelB, setModelB] = useState(AI_MODELS[1]);
  const [openMarkets, setOpenMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);

  // live price (throttled)
  const [price, setPrice] = useState(null);
  const [startPrice, setStartPrice] = useState(null);
  const wsRef = useRef(null);
  const lastPriceRef = useRef(null);
  const lastUpdateRef = useRef(0);

  // AI predictions
  const [predA, setPredA] = useState({ side: "Bullish", conf: 65 });
  const [predB, setPredB] = useState({ side: "Bearish", conf: 60 });

  // betting state
  const [stake, setStake] = useState(10);
  const [selectedBet, setSelectedBet] = useState(null); // 'A' | 'B'
  const [userBetOutcome, setUserBetOutcome] = useState(null); // 0 or 1
  const [lockedPredA, setLockedPredA] = useState(null);
  const [lockedPredB, setLockedPredB] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [battleTime, setBattleTime] = useState(0);
  const [targetTime, setTargetTime] = useState(0);

  // leaderboard & history
  const [leaderboard, setLeaderboard] = useState({ [modelA]: 0, [modelB]: 0 });
  const [history, setHistory] = useState([]);
  
  // result modal
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [currentMarketId, setCurrentMarketId] = useState(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      const markets = await getOpenMarkets();
      setOpenMarkets(markets);
      const assetMarket = markets.find(m => m.title.includes(asset.replace('USDT', '')));
      if (assetMarket) setSelectedMarket(assetMarket);
    };
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 30000);
    return () => clearInterval(interval);
  }, [asset]);

  // WebSocket price provider (Pyth Network real-time data)
  // Throttle updates to avoid rapid re-renders causing perceived flicker
  useEffect(() => {
    const symbol = asset?.toLowerCase();
    if (!symbol) return;

    // Subscribe to Pyth Network price feed
    const unsubscribe = subscribeToPythPrice(symbol, (priceData) => {
      const p = priceData.price;
      lastPriceRef.current = p;
      const now = Date.now();
      // update state at most once every 300ms
      if (now - lastUpdateRef.current > 300) {
        lastUpdateRef.current = now;
        setPrice(p);
      }
    });

      wsRef.current.onerror = () => { /* ignore for demo */ };
    } catch (e) {
      // ignore
    }

    return () => {
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [asset]);

  // AI prediction mock
  useEffect(() => {
    let mounted = true;
    const fetchPred = async () => {
      const pA = await fetchMockPrediction(modelA, asset, timeframe);
      const pB = await fetchMockPrediction(modelB, asset, timeframe);
      if (!mounted) return;
      setPredA(pA);
      setPredB(pB);
    };
    fetchPred();
    const id = setInterval(fetchPred, 10_000);
    return () => { mounted = false; clearInterval(id); };
  }, [modelA, modelB, asset, timeframe]);

  async function fetchMockPrediction(model, asset, timeframe) {
    const seed = (model + asset + timeframe).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    const v = Math.abs((Date.now() + seed) % 100);
    await new Promise((r) => setTimeout(r, 120));
    return { side: v > 50 ? "Bullish" : "Bearish", conf: 40 + (v % 60) };
  }

  // Battle flow
  const chooseBet = (who) => {
    setSelectedBet(who);
    setLockedPredA(predA);
    setLockedPredB(predB);
  };

  const startBattle = async () => {
    if (!isConnected) return alert("Connect wallet terlebih dahulu.");
    if (!selectedBet) return alert("Pilih model AI untuk bertaruh terlebih dahulu.");
    
    try {
      const timeframeSeconds = 600;
      
      if (!selectedMarket) {
        alert('No open market available. Please wait or select another asset.');
        return;
      }
      
      const marketId = selectedMarket.id;
      setCurrentMarketId(marketId);
      
      // Get AI prediction for selected model (use locked prediction)
      const selectedPred = selectedBet === 'A' ? lockedPredA : lockedPredB;
      const outcome = selectedPred.side === 'Bullish' ? 0 : 1;
      setUserBetOutcome(outcome);
      
      console.log(`[DEBUG] Selected AI: ${selectedBet}, Prediction: ${selectedPred.side}, Outcome: ${outcome}`);
      
      await handlePlaceBet(marketId, outcome, stake);
      
      console.log(`Bet placed on Market ${marketId}, AI ${selectedBet} predicts ${selectedPred.side}, Outcome: ${outcome}`);
      
      setStartPrice(price);
      setCountdown(5);
      setBattleTime(timeframeSeconds);
      setTargetTime(timeframeSeconds);
      setIsRunning(true);
    } catch (error) {
      console.error('Start battle error:', error);
    }
  };

  useEffect(() => {
    if (!isRunning) return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [isRunning, countdown]);
  
  // Battle timer (countdown)
  useEffect(() => {
    if (!isRunning || countdown > 0) return;
    if (battleTime <= 0) {
      resolveBattle();
      return;
    }
    const interval = setInterval(() => {
      setBattleTime((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, countdown, battleTime]);

  const resolveBattle = async () => {
    setIsRunning(false);
    setCountdown(0);
    
    console.log(`[DEBUG] Battle ended. Market ID: ${currentMarketId}, User Bet Outcome: ${userBetOutcome}`);
    
    if (!currentMarketId || userBetOutcome === null) {
      console.error('[DEBUG] Missing marketId or userBetOutcome');
      alert('Battle data missing. Please try again.');
      setSelectedBet(null);
      return;
    }
    
    // Wait for backend to resolve (check every 2 seconds for 15 minutes)
    let attempts = 0;
    const maxAttempts = 450; // 15 minutes (10 min battle + 5 min buffer)
    
    const checkResolved = setInterval(async () => {
      attempts++;
      console.log(`[DEBUG] Polling attempt ${attempts}/${maxAttempts} for market ${currentMarketId}`);
      
      try {
        const market = await getMarket(currentMarketId);
        const status = market.status; // 0=OPEN, 1=CLOSED, 2=RESOLVED
        console.log(`[DEBUG] Market ${currentMarketId} status: ${status}`);
        
        if (status === 2) { // RESOLVED
          clearInterval(checkResolved);
          
          const winningOutcome = market.winningOutcome.toNumber();
          const outcome = winningOutcome === 0 ? "Bullish" : "Bearish";
          const userWon = winningOutcome === userBetOutcome;
          
          console.log(`[DEBUG RESULT] Market ${currentMarketId} resolved:`);
          console.log(`  - Winning Outcome: ${winningOutcome} (${outcome})`);
          console.log(`  - User Bet Outcome: ${userBetOutcome}`);
          console.log(`  - User Won: ${userWon}`);
          
          setHistory((h) => [{ id: Date.now(), asset, outcome, win: userWon }, ...h]);
          setSelectedBet(null);
          setLockedPredA(null);
          setLockedPredB(null);
          
          // Show result modal (with 2% fee)
          const grossPayout = stake * 2;
          const fee = grossPayout * 0.02;
          const netPayout = grossPayout - fee;
          
          setBattleResult({
            won: userWon,
            prediction: userBetOutcome === 0 ? 'BULLISH' : 'BEARISH',
            outcome: outcome.toUpperCase(),
            stake: stake,
            payout: userWon ? netPayout : 0,
            profit: userWon ? (netPayout - stake) : -stake,
            fee: userWon ? fee : 0,
            asset: asset
          });
          setShowResult(true);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkResolved);
          console.log('[DEBUG] Timeout waiting for resolution');
          alert('Battle ended! Check Portfolio in a moment for your rewards.');
          setSelectedBet(null);
          setLockedPredA(null);
          setLockedPredB(null);
        }
      } catch (error) {
        console.error('[DEBUG] Check resolved error:', error);
      }
    }, 2000); // Check every 2 seconds
  };

  // UI
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI vs AI Battle Arena</h3>
          <Button onClick={onClose} variant="outline">✕ Close</Button>
        </div>

        <div className="grid grid-cols-3 gap-4 items-center">
          <div>
            <Label>CURRENT PRICE</Label>
            <div className="text-2xl font-bold text-cyan-400">{price ? `${price.toLocaleString()}` : "$---"}</div>
            {isRunning && startPrice && (
              <div className="text-xs text-slate-400 mt-1">
                Start: ${startPrice.toLocaleString()}
              </div>
            )}
            <div className="text-[10px] text-slate-500 mt-1">Powered by Pyth Network</div>
          </div>

          <div className="col-span-1">
            <Label>Select Market</Label>
            <div className="mt-1">
              <Select value={selectedMarket?.id?.toString()} onValueChange={(v) => {
                const market = openMarkets.find(m => m.id.toString() === v);
                setSelectedMarket(market);
                if (market?.title.includes('BTC')) setAsset('BTCUSDT');
                else if (market?.title.includes('ETH')) setAsset('ETHUSDT');
                else if (market?.title.includes('SOL')) setAsset('SOLUSDT');
                else if (market?.title.includes('BNB')) setAsset('BNBUSDT');
                else if (market?.title.includes('XRP')) setAsset('XRPUSDT');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Market" />
                </SelectTrigger>
                <SelectContent>
                  {openMarkets.length === 0 && (
                    <SelectItem value="none" disabled>Loading markets...</SelectItem>
                  )}
                  {openMarkets.map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.title} ({Math.floor((m.closeTime - Date.now()/1000)/60)}m left)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedMarket && (
              <div className="text-xs text-slate-400 mt-1">
                Market #{selectedMarket.id} • Pool: {parseFloat(selectedMarket.totalStaked).toFixed(2)} AION
              </div>
            )}
          </div>

          <div className="text-right">
            <Label>Battle Duration</Label>
            <div className="mt-1 text-2xl font-bold text-cyan-400">10 Minutes</div>
            <div className="text-xs text-slate-400">Fast resolution</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">AI Model 1</div>
            </div>
            <Select value={modelA} onValueChange={(v) => setModelA(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 text-xs text-slate-400">Confidence: {predA.conf}%</div>
            <div className={`mt-3 font-bold ${predA.side === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>{predA.side === 'Bullish' ? '📈 BULLISH' : '📉 BEARISH'}</div>
            <div className="mt-4">
              <Button variant={selectedBet === 'A' ? 'secondary' : 'default'} onClick={() => chooseBet('A')} className="w-full">Bet On AI 1</Button>
            </div>
          </div>

          <div className="p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">AI Model 2</div>
            </div>
            <Select value={modelB} onValueChange={(v) => setModelB(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 text-xs text-slate-400">Confidence: {predB.conf}%</div>
            <div className={`mt-3 font-bold ${predB.side === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>{predB.side === 'Bullish' ? '📈 BULLISH' : '📉 BEARISH'}</div>
            <div className="mt-4">
              <Button variant={selectedBet === 'B' ? 'secondary' : 'default'} onClick={() => chooseBet('B')} className="w-full">Bet On AI 2</Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 items-end">
          <div>
            <Label>Stake Amount (AION)</Label>
            <input type="number" className="w-full mt-1 p-2 rounded-md bg-slate-900 border" value={stake} onChange={(e) => setStake(Number(e.target.value))} />
            <div className="text-xs text-slate-400 mt-1">🎯 Win: ~1.96x stake (2% fee)</div>
          </div>

          <div className="text-right">
            {isRunning && countdown === 0 && battleTime > 0 && (
              <div className="mb-2 text-center">
                <div className="text-sm text-slate-400">Time Remaining ({timeframe})</div>
                <div className="text-3xl font-mono font-bold text-cyan-400">
                  {Math.floor(battleTime / 60)}:{(battleTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(battleTime / targetTime) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {isRunning && countdown > 0 && (
              <div className="mb-2 text-center">
                <div className="text-sm text-slate-400">Starting in</div>
                <div className="text-4xl font-bold text-yellow-400 animate-pulse">
                  {countdown}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={() => { setSelectedBet(null); setStake(10); }} disabled={isRunning}>Cancel</Button>
              <Button onClick={startBattle} disabled={isRunning || contractLoading} className="bg-emerald-500">
                {contractLoading ? 'Approving...' : 'Start Battle'}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <Label>Leaderboard</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.keys(leaderboard).map((k) => (
                <div key={k} className="p-2 bg-slate-900 rounded"> 
                  <div className="text-xs text-slate-400">{k}</div>
                  <div className="font-bold text-lg">{leaderboard[k]}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>History</Label>
            <div className="mt-2 max-h-40 overflow-auto text-xs">
              {history.map((h) => (
                <div key={h.id} className="p-2 border-b border-slate-700">
                  <div>{h.asset} — {h.outcome} {h.win ? '✅' : '❌'}</div>
                  <div className="text-slate-400">Result: {h.outcome}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <BattleResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        result={battleResult}
      />
    </div>
  );
}

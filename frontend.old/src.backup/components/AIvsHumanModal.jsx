import React, { useEffect, useRef, useState } from "react";
import BattleResultModal from '@/components/BattleResultModal';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/context/WalletContext';
import { getOpenMarkets } from '@/utils/contract';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Label = ({ children, className = "" }) => (
  <label className={`text-sm font-medium ${className}`}>{children}</label>
);

const COINS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];

const AI_MODELS = ["GPT-5 Oracle", "Claude-3", "DeepMind-FX", "Bloom-Alpha"];

export default function AIvsHumanModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return <FullscreenBattleModal onClose={onClose} />;
}

function FullscreenBattleModal({ onClose }) {
  const { handlePlaceBet, loading: contractLoading } = useContract();
  const { isConnected } = useWallet();
  
  const [asset, setAsset] = useState(COINS[0]);
  const [timeframe] = useState('M10');
  const [aiModel, setAiModel] = useState(AI_MODELS[0]);
  const [openMarkets, setOpenMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);

  const [price, setPrice] = useState(null);
  const [startPrice, setStartPrice] = useState(null);
  const wsRef = useRef(null);
  const lastPriceRef = useRef(null);
  const lastUpdateRef = useRef(0);

  const [aiPred, setAiPred] = useState({ side: "Bullish", conf: 65 });
  const [userPred, setUserPred] = useState(null); // 'Bullish' | 'Bearish'

  const [stake, setStake] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [battleTime, setBattleTime] = useState(0);
  const [targetTime, setTargetTime] = useState(0);

  const [leaderboard, setLeaderboard] = useState({ AI: 0, Human: 0 });
  const [history, setHistory] = useState([]);
  
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState(null);

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

  useEffect(() => {
    const symbol = asset?.toLowerCase();
    if (!symbol) return;

    try {
      if (wsRef.current) {
        try { wsRef.current.close(); } catch (e) {}
      }
      wsRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);

      wsRef.current.onmessage = (evt) => {
        try {
          const d = JSON.parse(evt.data);
          if (d && d.p) {
            const p = parseFloat(d.p);
            lastPriceRef.current = p;
            const now = Date.now();
            if (now - lastUpdateRef.current > 300) {
              lastUpdateRef.current = now;
              setPrice(p);
            }
          }
        } catch (e) {}
      };

      wsRef.current.onerror = () => {};
    } catch (e) {}

    return () => {
      try { wsRef.current?.close(); } catch (e) {}
      wsRef.current = null;
    };
  }, [asset]);

  useEffect(() => {
    let mounted = true;
    const fetchPred = async () => {
      const pA = await fetchMockPrediction(aiModel, asset, timeframe);
      if (!mounted) return;
      setAiPred(pA);
    };
    fetchPred();
    const id = setInterval(fetchPred, 10_000);
    return () => { mounted = false; clearInterval(id); };
  }, [aiModel, asset, timeframe]);

  async function fetchMockPrediction(model, asset, timeframe) {
    const seed = (model + asset + timeframe).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    const v = Math.abs((Date.now() + seed) % 100);
    await new Promise((r) => setTimeout(r, 120));
    return { side: v > 50 ? "Bullish" : "Bearish", conf: 40 + (v % 60) };
  }

  const choosePrediction = (side) => setUserPred(side);

  const startBattle = async () => {
    if (!isConnected) return alert("Connect wallet terlebih dahulu.");
    if (!userPred) return alert("Pilih prediksi Anda terlebih dahulu (Bullish atau Bearish).");
    
    try {
      const timeframeSeconds = 600;
      
      if (!selectedMarket) {
        alert('No open market available. Please wait or select another asset.');
        return;
      }
      
      const marketId = selectedMarket.id;
      const outcome = userPred === 'Bullish' ? 0 : 1;
      await handlePlaceBet(marketId, outcome, stake);
      
      console.log(`Bet placed on Market ${marketId}`);
      
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
    const before = startPrice || price;
    const move = (Math.random() - 0.5) * 0.02;
    const after = before ? +(before * (1 + move)).toFixed(2) : null;
    const outcome = after && before ? (after > before ? "Bullish" : after < before ? "Bearish" : "Flat") : (Math.random() > 0.5 ? "Bullish" : "Bearish");

    const aiWins = aiPred.side === outcome;
    const humanWins = userPred === outcome;

    setLeaderboard((lb) => ({ 
      AI: lb.AI + (aiWins ? 1 : 0), 
      Human: lb.Human + (humanWins ? 1 : 0) 
    }));

    const grossPayout = stake * 2;
    const fee = grossPayout * 0.02;
    const netPayout = grossPayout - fee;
    const payout = humanWins ? netPayout : 0;

    setHistory((h) => [{ id: Date.now(), asset, before, after, outcome, userPred, aiPred: aiPred.side, win: humanWins, payout }, ...h]);

    setIsRunning(false);
    setCountdown(0);
    setUserPred(null);

    setBattleResult({
      won: humanWins,
      prediction: userPred.toUpperCase(),
      outcome: outcome.toUpperCase(),
      stake: stake,
      payout: payout,
      profit: humanWins ? netPayout - stake : 0,
      fee: humanWins ? fee : 0,
      asset: asset
    });
    setShowResult(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI vs Human Battle Arena</h3>
          <Button onClick={onClose} variant="outline">✕ Close</Button>
        </div>

        <div className="grid grid-cols-3 gap-4 items-center">
          <div>
            <Label>CURRENT PRICE</Label>
            <div className="text-2xl font-bold text-cyan-400">{price ? `$${price.toLocaleString()}` : "$---"}</div>
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
            <div className="text-xs text-slate-400">Fixed duration for all battles</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-900/30 border-2 border-purple-500/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-purple-300">🤖 AI Model</div>
            </div>
            <Select value={aiModel} onValueChange={(v) => setAiModel(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 text-xs text-slate-400">Confidence: {aiPred.conf}%</div>
            <div className={`mt-3 font-bold text-lg ${aiPred.side === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>
              {aiPred.side === 'Bullish' ? '📈 BULLISH' : '📉 BEARISH'}
            </div>
          </div>

          <div className="p-4 bg-slate-800 rounded-lg border-2 border-slate-600">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-pink-300">👤 Your Prediction</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button 
                variant={userPred === 'Bullish' ? 'default' : 'outline'} 
                onClick={() => choosePrediction('Bullish')} 
                className={`w-full ${userPred === 'Bullish' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                disabled={isRunning}
              >
                📈 Bullish
              </Button>
              <Button 
                variant={userPred === 'Bearish' ? 'default' : 'outline'} 
                onClick={() => choosePrediction('Bearish')} 
                className={`w-full ${userPred === 'Bearish' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                disabled={isRunning}
              >
                📉 Bearish
              </Button>
            </div>
            {userPred && (
              <div className={`mt-3 font-bold text-center ${userPred === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>
                Selected: {userPred === 'Bullish' ? '📈 BULLISH' : '📉 BEARISH'}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 items-end">
          <div>
            <Label>Stake Amount (AION)</Label>
            <input type="number" className="w-full mt-1 p-2 rounded-md bg-slate-900 border" value={stake} onChange={(e) => setStake(Number(e.target.value))} disabled={isRunning} />
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
                <div className="text-4xl font-bold text-yellow-400 animate-pulse">{countdown}</div>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={() => { setUserPred(null); setStake(10); }} disabled={isRunning}>Cancel</Button>
              <Button onClick={startBattle} disabled={isRunning || contractLoading} className="bg-gradient-to-r from-purple-500 to-pink-500">
                {contractLoading ? 'Approving...' : 'Start Battle'}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <Label>Leaderboard</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="p-2 bg-purple-900/50 rounded"> 
                <div className="text-xs text-purple-400">🤖 AI</div>
                <div className="font-bold text-lg text-purple-300">{leaderboard.AI}</div>
              </div>
              <div className="p-2 bg-pink-900/50 rounded"> 
                <div className="text-xs text-pink-400">👤 Human</div>
                <div className="font-bold text-lg text-pink-300">{leaderboard.Human}</div>
              </div>
            </div>
          </div>

          <div>
            <Label>History</Label>
            <div className="mt-2 max-h-40 overflow-auto text-xs">
              {history.map((h) => (
                <div key={h.id} className="p-2 border-b border-slate-700">
                  <div>Outcome: {h.outcome} • You: {h.userPred} • AI: {h.aiPred}</div>
                  <div className="text-slate-400">{h.before ?? '-'} → {h.after ?? '-'} • {h.win ? `✅ Won ${h.payout}` : '❌ Lost'}</div>
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

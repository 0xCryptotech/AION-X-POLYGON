import React, { useEffect, useRef, useState } from "react";
import BattleResultModal from '@/components/BattleResultModal';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/context/WalletContext';
import { useContract } from '@/hooks/useContract';
import { getOpenMarkets } from '@/utils/contract';
import { User } from 'lucide-react';

const Label = ({ children, className = "" }) => (
  <label className={`text-sm font-medium ${className}`}>{children}</label>
);

const COINS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];


export default function HumanvsHumanModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return <FullscreenBattleModal onClose={onClose} />;
}

function FullscreenBattleModal({ onClose }) {
  const { address, isConnected } = useWallet();
  const { handlePlaceBet, loading: contractLoading } = useContract();
  const [asset, setAsset] = useState(COINS[0]);
  const [timeframe] = useState('M10');
  const [openMarkets, setOpenMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);

  const [price, setPrice] = useState(null);
  const [startPrice, setStartPrice] = useState(null);
  const wsRef = useRef(null);
  const lastPriceRef = useRef(null);
  const lastUpdateRef = useRef(0);

  const [player1Name] = useState('Player 1');
  const [player1Avatar] = useState(null);
  const [player1Ready, setPlayer1Ready] = useState(false);
  const [player1Pred, setPlayer1Pred] = useState(null);
  
  const [player2Name] = useState('Player 2');
  const [player2Avatar] = useState(null);
  const [player2Ready, setPlayer2Ready] = useState(false);
  const [player2Pred, setPlayer2Pred] = useState(null);

  const [stake, setStake] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [battleTime, setBattleTime] = useState(0);
  const [targetTime, setTargetTime] = useState(0);

  const [leaderboard, setLeaderboard] = useState({ Player1: 0, Player2: 0 });
  const [history, setHistory] = useState([]);
  
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  
  const bothReady = player1Ready && player2Ready;

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

  const handlePlayer1Ready = () => {
    if (!player1Pred) return alert("Player 1 harus memilih prediksi.");
    setPlayer1Ready(true);
  };
  
  const handlePlayer2Ready = () => {
    if (!player2Pred) return alert("Player 2 harus memilih prediksi.");
    setPlayer2Ready(true);
  };

  const startBattle = async () => {
    if (!isConnected) return alert("Connect wallet terlebih dahulu.");
    if (!bothReady) return alert("Kedua player harus ready terlebih dahulu.");
    
    try {
      const timeframeSeconds = 600;
      
      if (!selectedMarket) {
        alert('No open market available. Please wait or select another asset.');
        return;
      }
      
      const marketId = selectedMarket.id;
      const outcome = player1Pred === 'Bullish' ? 0 : 1;
      await handlePlaceBet(marketId, outcome, stake);
      
      console.log(`Player 1 bet placed on Market ${marketId}`);
      
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

    const p1Wins = player1Pred === outcome;
    const p2Wins = player2Pred === outcome;

    setLeaderboard((lb) => ({ 
      Player1: lb.Player1 + (p1Wins ? 1 : 0), 
      Player2: lb.Player2 + (p2Wins ? 1 : 0) 
    }));

    const grossPayout = stake * 2;
    const fee = grossPayout * 0.02;
    const netPayout = grossPayout - fee;
    const p1Payout = p1Wins ? netPayout : 0;
    const p2Payout = p2Wins ? netPayout : 0;

    setHistory((h) => [{ 
      id: Date.now(), 
      asset, 
      before, 
      after, 
      outcome, 
      p1Pred: player1Pred, 
      p2Pred: player2Pred, 
      p1Win: p1Wins, 
      p2Win: p2Wins,
      p1Payout,
      p2Payout
    }, ...h]);

    setIsRunning(false);
    setCountdown(0);
    setPlayer1Pred(null);
    setPlayer2Pred(null);
    setPlayer1Ready(false);
    setPlayer2Ready(false);

    // Show result for current user (assume player 1)
    setBattleResult({
      won: p1Wins,
      prediction: player1Pred.toUpperCase(),
      outcome: outcome.toUpperCase(),
      stake: stake,
      payout: p1Payout,
      profit: p1Wins ? netPayout - stake : 0,
      fee: p1Wins ? fee : 0,
      asset: asset
    });
    setShowResult(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">Human vs Human Battle Arena</h3>
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
            <div className="text-[10px] text-slate-500 mt-1">Powered by Polygon Market Data</div>
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
          <div className={`p-4 border-2 rounded-lg ${player1Ready ? 'bg-pink-900/50 border-pink-500' : 'bg-pink-900/30 border-pink-500/50'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center overflow-hidden">
                  {player1Avatar ? (
                    <img src={player1Avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-pink-300">{player1Name}</div>
                  <div className="text-xs text-slate-400">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}</div>
                </div>
              </div>
              {player1Ready && <span className="text-xs text-green-400 font-bold">✓ READY</span>}
            </div>
            <div className="font-semibold text-pink-300 mb-3">👤 Player 1's Prediction</div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={player1Pred === 'Bullish' ? 'default' : 'outline'} 
                onClick={() => setPlayer1Pred('Bullish')} 
                className={`w-full ${player1Pred === 'Bullish' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                disabled={player1Ready || isRunning}
              >
                📈 Bullish
              </Button>
              <Button 
                variant={player1Pred === 'Bearish' ? 'default' : 'outline'} 
                onClick={() => setPlayer1Pred('Bearish')} 
                className={`w-full ${player1Pred === 'Bearish' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                disabled={player1Ready || isRunning}
              >
                📉 Bearish
              </Button>
            </div>
            {player1Pred && (
              <div className={`mt-3 font-bold text-center ${player1Pred === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>
                Selected: {player1Pred === 'Bullish' ? '📈 BULLISH' : '📉 BEARISH'}
              </div>
            )}
            {!player1Ready && (
              <Button onClick={handlePlayer1Ready} className="w-full mt-4 bg-pink-500 hover:bg-pink-600" disabled={isRunning}>
                I'm Ready!
              </Button>
            )}
            {player1Ready && (
              <div className="mt-4 text-center text-green-400 font-bold">Waiting for Player 2...</div>
            )}
          </div>

          <div className={`p-4 border-2 rounded-lg ${player2Ready ? 'bg-orange-900/50 border-orange-500' : 'bg-orange-900/30 border-orange-500/50'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center overflow-hidden">
                  {player2Avatar ? (
                    <img src={player2Avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-orange-300">{player2Name}</div>
                  <div className="text-xs text-slate-400">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}</div>
                </div>
              </div>
              {player2Ready && <span className="text-xs text-green-400 font-bold">✓ READY</span>}
            </div>
            <div className="font-semibold text-orange-300 mb-3">👤 Player 2's Prediction</div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={player2Pred === 'Bullish' ? 'default' : 'outline'} 
                onClick={() => setPlayer2Pred('Bullish')} 
                className={`w-full ${player2Pred === 'Bullish' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                disabled={player2Ready || isRunning}
              >
                📈 Bullish
              </Button>
              <Button 
                variant={player2Pred === 'Bearish' ? 'default' : 'outline'} 
                onClick={() => setPlayer2Pred('Bearish')} 
                className={`w-full ${player2Pred === 'Bearish' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                disabled={player2Ready || isRunning}
              >
                📉 Bearish
              </Button>
            </div>
            {player2Pred && (
              <div className={`mt-3 font-bold text-center ${player2Pred === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>
                Selected: {player2Pred === 'Bullish' ? '📈 BULLISH' : '📉 BEARISH'}
              </div>
            )}
            {!player2Ready && (
              <Button onClick={handlePlayer2Ready} className="w-full mt-4 bg-orange-500 hover:bg-orange-600" disabled={isRunning}>
                I'm Ready!
              </Button>
            )}
            {player2Ready && (
              <div className="mt-4 text-center text-green-400 font-bold">Waiting for Player 1...</div>
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
              <Button onClick={() => { setPlayer1Pred(null); setPlayer2Pred(null); setPlayer1Ready(false); setPlayer2Ready(false); setStake(10); }} disabled={isRunning}>Reset</Button>
              <Button onClick={startBattle} disabled={!bothReady || isRunning || contractLoading} className="bg-gradient-to-r from-pink-500 to-orange-500">
                {contractLoading ? 'Approving...' : bothReady ? 'Start Battle' : 'Waiting for Players...'}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <Label>Leaderboard</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="p-2 bg-pink-900/50 rounded"> 
                <div className="text-xs text-pink-400">👤 Player 1</div>
                <div className="font-bold text-lg text-pink-300">{leaderboard.Player1}</div>
              </div>
              <div className="p-2 bg-orange-900/50 rounded"> 
                <div className="text-xs text-orange-400">👤 Player 2</div>
                <div className="font-bold text-lg text-orange-300">{leaderboard.Player2}</div>
              </div>
            </div>
          </div>

          <div>
            <Label>History</Label>
            <div className="mt-2 max-h-40 overflow-auto text-xs">
              {history.map((h) => (
                <div key={h.id} className="p-2 border-b border-slate-700">
                  <div>Outcome: {h.outcome}</div>
                  <div className="text-slate-400">
                    P1: {h.p1Pred} {h.p1Win ? '✅' : '❌'} • P2: {h.p2Pred} {h.p2Win ? '✅' : '❌'}
                  </div>
                  <div className="text-slate-500">{h.before ?? '-'} → {h.after ?? '-'}</div>
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

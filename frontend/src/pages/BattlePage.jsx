import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Swords, Bot, User, Trophy, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import AIBattleModal from '@/components/AIBattleModal';
import AIvsHumanModal from '@/components/AIvsHumanModal';
import HumanvsHumanModal from '@/components/HumanvsHumanModal';

const TIMEFRAMES = ["M1", "M5", "M10", "M15", "M30", "H1"];
const AI_MODELS = ["GPT-5 Oracle", "Claude-3", "DeepMind-FX", "Bloom-Alpha"];

export const BattlePage = () => {
  const [selectedMarket, setSelectedMarket] = useState('crypto');
  const [selectedAI, setSelectedAI] = useState('ai-alpha');
  const [modalOpen, setModalOpen] = useState(false);
  const [battleMode, setBattleMode] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const livePrices = {
    'BTC': '42,350.00',
    'ETH': '2,245.50',
    'GOLD': '2,015.30'
  };
  
  const [category, setCategory] = useState('crypto');
  const [aiModel, setAiModel] = useState('ai-alpha');
  const [timeFrame, setTimeFrame] = useState('M5');
  const [betOn, setBetOn] = useState('ai1');
  const [betAmount, setBetAmount] = useState(0.01);

  const battles = [
    {
      id: 1,
      mode: 'AI_VS_AI',
      title: 'Live Prediksi',
      category: 'crypto',
      asset: 'BTC',
      livePrice: '42,350.00',
      timeFrame: 'M5',
      participant1: { name: 'AI Alpha', type: 'ai', prediction: 'UP', confidence: 85, model: 'GPT-5-Trader' },
      participant2: { name: 'AI Beta', type: 'ai', prediction: 'DOWN', confidence: 72, model: 'DeepMind-FX' },
      status: 'active',
      pool: '5.2 MATIC',
      endTime: '2h 30m'
    },


    {
      id: 2,
      mode: 'AI_VS_AI',
      title: 'ETH Battle',
      category: 'crypto',
      asset: 'ETH',
      livePrice: '2,245.50',
      timeFrame: 'M15',
      participant1: { name: 'AI Gamma', type: 'ai', prediction: 'UP', confidence: 78, model: 'Bloom-Alpha' },
      participant2: { name: 'AI Delta', type: 'ai', prediction: 'DOWN', confidence: 82, model: 'Custom Model' },
      status: 'active',
      pool: '3.8 MATIC',
      endTime: '5h 15m'
    },
    {
      id: 3,
      mode: 'AI_VS_AI',
      title: 'Gold Prediction',
      category: 'market',
      asset: 'GOLD',
      livePrice: '2,015.30',
      timeFrame: 'H1',
      participant1: { name: 'AI Alpha', type: 'ai', prediction: 'UP', confidence: 68, model: 'GPT-5-Trader' },
      participant2: { name: 'AI Gamma', type: 'ai', prediction: 'DOWN', confidence: 75, model: 'Bloom-Alpha' },
      status: 'active',
      pool: '2.5 MATIC',
      endTime: '3h 10m'
    },
    {
      id: 4,
      mode: 'AI_VS_HUMAN',
      title: 'BNB Battle',
      category: 'crypto',
      asset: 'BNB',
      livePrice: '312.45',
      timeFrame: 'M10',
      participant1: { name: 'AI Beta', type: 'ai', prediction: 'UP', confidence: 80, model: 'DeepMind-FX' },
      participant2: { name: 'CryptoKing', type: 'human', prediction: 'DOWN', confidence: 90 },
      status: 'active',
      pool: '4.2 MATIC',
      endTime: '1h 45m'
    },
    {
      id: 5,
      mode: 'AI_VS_HUMAN',
      title: 'SOL Showdown',
      category: 'crypto',
      asset: 'SOL',
      livePrice: '98.75',
      timeFrame: 'M5',
      participant1: { name: 'AI Delta', type: 'ai', prediction: 'DOWN', confidence: 73, model: 'Custom Model' },
      participant2: { name: 'ProTrader', type: 'human', prediction: 'UP', confidence: 85 },
      status: 'active',
      pool: '3.1 MATIC',
      endTime: '4h 20m'
    },
    {
      id: 6,
      mode: 'HUMAN_VS_HUMAN',
      title: 'BTC Duel',
      category: 'crypto',
      asset: 'BTC',
      livePrice: '42,350.00',
      timeFrame: 'M30',
      participant1: { name: 'Trader1', type: 'human', prediction: 'UP', confidence: 65 },
      participant2: { name: 'Trader2', type: 'human', prediction: 'DOWN', confidence: 80 },
      status: 'active',
      pool: '2.1 MATIC',
      endTime: '1h 45m'
    },
    {
      id: 7,
      mode: 'HUMAN_VS_HUMAN',
      title: 'ETH Challenge',
      category: 'crypto',
      asset: 'ETH',
      livePrice: '2,245.50',
      timeFrame: 'M15',
      participant1: { name: 'WhaleTrader', type: 'human', prediction: 'DOWN', confidence: 92 },
      participant2: { name: 'BullRunner', type: 'human', prediction: 'UP', confidence: 88 },
      status: 'active',
      pool: '6.5 MATIC',
      endTime: '2h 10m'
    }
  ];

  const aiVsAi = battles.filter(b => b.mode === 'AI_VS_AI' && (categoryFilter === 'all' || b.category === categoryFilter));
  const aiVsHuman = battles.filter(b => b.mode === 'AI_VS_HUMAN');
  const humanVsHuman = battles.filter(b => b.mode === 'HUMAN_VS_HUMAN');

  const [openModal, setOpenModal] = useState(null);
  const [livePriceDisplay, setLivePriceDisplay] = useState('42,350.00');
  const [predA, setPredA] = useState({ side: "Bullish", conf: 65 });
  const [predB, setPredB] = useState({ side: "Bearish", conf: 60 });
  const [stake, setStake] = useState(10);
  const [selectedBet, setSelectedBet] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [leaderboard, setLeaderboard] = useState({});
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);
  const audioRef = useRef(null);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [showAIvsHumanModal, setShowAIvsHumanModal] = useState(false);
  const [showHumanvsHumanModal, setShowHumanvsHumanModal] = useState(false);
  
  const [selectedAIModel, setSelectedAIModel] = useState('GPT-4 Oracle');
  const [selectedCategory, setSelectedCategory] = useState('Crypto');
  const [selectedAsset, setSelectedAsset] = useState('BTCUSDT');
  const [livePrice, setLivePrice] = useState(111297.01);
  const [confidence, setConfidence] = useState(97.8);
  const [trend, setTrend] = useState('Bullish');
  const [timeframePredictions, setTimeframePredictions] = useState([
    { tf: 'M1', change: 0.1, trend: 'up' },
    { tf: 'M5', change: 0.4, trend: 'up' },
    { tf: 'M10', change: 0.4, trend: 'up' },
    { tf: 'M15', change: -0.8, trend: 'down' },
    { tf: 'M30', change: 1.4, trend: 'up' }
  ]);
  
  const aiModels = ['GPT-4 Oracle', 'Claude-3 Opus', 'DeepMind-FX', 'Bloom-Alpha'];
  const categories = ['Crypto', 'Market', 'Esport'];
  const assetsByCategory = {
    'Crypto': ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'],
    'Market': ['GOLD', 'SILVER', 'OIL', 'SP500'],
    'Esport': ['DOTA2', 'LOL', 'CSGO', 'VALORANT']
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrice(prev => {
        const change = (Math.random() - 0.5) * 100;
        return +(prev + change).toFixed(2);
      });
      setConfidence(prev => {
        const change = (Math.random() - 0.5) * 2;
        return Math.min(99.9, Math.max(85, +(prev + change).toFixed(1)));
      });
      setTrend(Math.random() > 0.3 ? 'Bullish' : 'Bearish');
      setTimeframePredictions(prev => prev.map(tf => ({
        ...tf,
        change: +((Math.random() - 0.5) * 2).toFixed(1),
        trend: Math.random() > 0.4 ? 'up' : 'down'
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentBattle = battles.find(b => b.id === openModal);

  useEffect(() => {
    if (!currentBattle) return;
    const symbol = currentBattle.asset === 'BTC' ? 'btcusdt' : currentBattle.asset === 'ETH' ? 'ethusdt' : currentBattle.asset === 'GOLD' ? 'xauusdt' : 'btcusdt';
    
    try {
      if (wsRef.current) wsRef.current.close();
      wsRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
      wsRef.current.onmessage = (evt) => {
        try {
          const d = JSON.parse(evt.data);
          if (d?.p) setLivePrice(parseFloat(d.p));
        } catch (e) {}
      };
    } catch (e) {}

    return () => {
      try { wsRef.current?.close(); } catch (e) {}
    };
  }, [currentBattle]);

  useEffect(() => {
    if (!currentBattle) return;
    const fetchPred = async () => {
      const pA = await mockPrediction(currentBattle.participant1.model);
      const pB = await mockPrediction(currentBattle.participant2.model);
      setPredA(pA);
      setPredB(pB);
    };
    fetchPred();
    const id = setInterval(fetchPred, 10000);
    return () => clearInterval(id);
  }, [currentBattle]);

  const mockPrediction = async (model) => {
    const v = Math.abs(Date.now() % 100);
    await new Promise(r => setTimeout(r, 100));
    return { side: v > 50 ? "Bullish" : "Bearish", conf: 40 + (v % 60) };
  };

  const playTone = (freq = 440) => {
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.value = 0.02;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => { try { o.stop(); } catch (e) {} }, 100);
    } catch (e) {}
  };

  const startBattle = () => {
    if (!selectedBet) return alert("Pilih AI model terlebih dahulu");
    setCountdown(5);
    setIsRunning(true);
    playTone(600);
  };

  useEffect(() => {
    if (!isRunning || !currentBattle) return;
    if (countdown <= 0) {
      resolveBattle();
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    playTone(400 + countdown * 80);
    return () => clearTimeout(t);
  }, [isRunning, countdown]);

  const resolveBattle = async () => {
    const before = livePrice;
    await new Promise(r => setTimeout(r, 800));
    const move = (Math.random() - 0.5) * 0.02;
    const after = before ? +(before * (1 + move)).toFixed(2) : null;
    const outcome = after && before ? (after > before ? "Bullish" : "Bearish") : "Bullish";

    const aWins = predA.side === outcome;
    const bWins = predB.side === outcome;

    setLeaderboard(lb => ({
      ...lb,
      [currentBattle.participant1.model]: (lb[currentBattle.participant1.model] || 0) + (aWins ? 1 : 0),
      [currentBattle.participant2.model]: (lb[currentBattle.participant2.model] || 0) + (bWins ? 1 : 0),
    }));

    const userWin = (selectedBet === 'A' && aWins) || (selectedBet === 'B' && bWins);
    const payout = userWin ? stake * 2 : 0;

    setHistory(h => [{ id: Date.now(), before, after, outcome, win: userWin, payout }, ...h]);
    setIsRunning(false);
    setCountdown(0);
    setSelectedBet(null);

    alert(`Outcome: ${outcome} — You ${userWin ? `won ${payout} AION` : 'lost'}`);
  };

  const BattleCard = ({ battle }) => {
    const handleClick = () => {
      if (battle.mode === 'AI_VS_AI') setShowBattleModal(true);
      if (battle.mode === 'AI_VS_HUMAN') setShowAIvsHumanModal(true);
      if (battle.mode === 'HUMAN_VS_HUMAN') setShowHumanvsHumanModal(true);
    };
    
    return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <CardContent className="relative pt-6 pb-6">
        <div className="text-center mb-4">
          <div className="text-sm font-bold text-purple-400 mb-1">{battle.mode.replace('_', ' ')}</div>
          <div className="text-lg font-bold text-white">{battle.asset}/USD - {battle.timeFrame}</div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center flex-1">
            <div className="bg-cyan-900/30 border border-cyan-500/40 rounded-lg p-3">
              <div className="text-sm font-semibold text-cyan-300 mb-1">{battle.participant1.model || battle.participant1.name}</div>
              <div className="text-2xl font-bold text-cyan-400">{battle.participant1.confidence}%</div>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-purple-400">VS</div>
          
          <div className="text-center flex-1">
            <div className="bg-pink-900/30 border border-pink-500/40 rounded-lg p-3">
              <div className="text-sm font-semibold text-pink-300 mb-1">{battle.participant2.model || battle.participant2.name}</div>
              <div className="text-2xl font-bold text-pink-400">{battle.participant2.confidence}%</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400 mb-1">Pot</div>
            <div className="text-sm font-bold text-white">{battle.pool}</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400 mb-1">Players</div>
            <div className="text-sm font-bold text-white">142</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400 mb-1">Time</div>
            <div className="text-sm font-bold text-white">{battle.endTime}</div>
          </div>
        </div>
        
        <Button onClick={handleClick} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-3 rounded-lg shadow-lg transition-all">
          👁️ Start Battle
        </Button>
      </CardContent>
    </Card>
    );
  };

  return (
    <>
    <AIBattleModal isOpen={showBattleModal} onClose={() => setShowBattleModal(false)} />
    <AIvsHumanModal isOpen={showAIvsHumanModal} onClose={() => setShowAIvsHumanModal(false)} />
    <HumanvsHumanModal isOpen={showHumanvsHumanModal} onClose={() => setShowHumanvsHumanModal(false)} />
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative text-center mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
          <div className="relative">
            <div className="flex items-center justify-center mb-6">
              <div className="relative animate-bounce">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 blur-3xl opacity-75 animate-pulse" />
                <Trophy className="relative h-20 w-20 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" fill="currentColor" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black ml-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-pulse">
                BATTLE ARENA
              </h1>
            </div>
            <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-6">
              ⚡ AI vs AI • Real-Time Predictions • Crypto Battles ⚡
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-2 border-green-500/50 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-green-300 font-bold">LIVE TRADING</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-900/50 to-red-900/50 border-2 border-orange-500/50 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all">
                <span className="text-orange-300 font-bold text-lg">🔥 12 ACTIVE BATTLES</span>
              </div>
            </div>
          </div>
        </div>



        <div className="mb-8">
          <div className="mb-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] hover:shadow-[0_0_70px_rgba(6,182,212,0.5)] transition-all duration-300">
              <CardContent className="pt-6 pb-6">
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-50" />
                    <div className="relative text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">⚡ LIVE AI PREDICTIONS ⚡</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">🤖 AI Model</div>
                    <Select value={selectedAIModel} onValueChange={setSelectedAIModel}>
                      <SelectTrigger className="bg-slate-900 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aiModels.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">📂 Category</div>
                    <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setSelectedAsset(assetsByCategory[val][0]); }}>
                      <SelectTrigger className="bg-slate-900 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">🪙 Asset</div>
                    <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                      <SelectTrigger className="bg-slate-900 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {assetsByCategory[selectedCategory].map(asset => (
                          <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className={`bg-gradient-to-br ${trend === 'Bullish' ? 'from-green-900/40 to-emerald-900/30 border-green-500/60 shadow-[0_0_40px_rgba(34,197,94,0.3)]' : 'from-red-900/40 to-rose-900/30 border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.3)]'} border-2 rounded-xl p-8 mb-4 relative overflow-hidden transition-all duration-500`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${trend === 'Bullish' ? 'from-green-500/5 to-emerald-500/5' : 'from-red-500/5 to-rose-500/5'}`} />
                  <div className="relative">
                    <div className="text-center mb-4">
                      <div className="text-sm text-slate-400 mb-2">₿ Bitcoin</div>
                      <div className={`text-xs ${trend === 'Bullish' ? 'text-green-400' : 'text-red-400'} mb-3`}>{selectedAIModel} • {confidence}%</div>
                      <div className={`text-4xl font-black bg-gradient-to-r ${trend === 'Bullish' ? 'from-green-400 to-emerald-400' : 'from-red-400 to-rose-400'} bg-clip-text text-transparent mb-2 transition-all duration-300`}>
                        ${livePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-slate-500 mb-4">Powered by Polygon Market Data</div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-3xl">{trend === 'Bullish' ? '📈' : '📉'}</div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${trend === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>{trend.toUpperCase()} TREND</div>
                          <div className="text-xs text-slate-400">AI predicts price will {trend === 'Bullish' ? 'rise' : 'fall'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {timeframePredictions.map((tf, idx) => (
                    <div key={idx} className={`${tf.trend === 'up' ? 'bg-green-900/30 border-green-500/40' : 'bg-red-900/30 border-red-500/40'} border rounded-lg p-2 text-center transition-all duration-500`}>
                      <div className="text-xs text-slate-400 mb-1">{tf.tf}</div>
                      <div className={`text-sm font-bold ${tf.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {tf.trend === 'up' ? '📈' : '📉'} {tf.change > 0 ? '+' : ''}{tf.change}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="relative mb-4">
                <div className="text-center">
                  <Bot className="h-10 w-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] mx-auto mb-2" />
                  <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI vs AI</h2>
                </div>
              </div>
              {aiVsAi.slice(0, 1).map(battle => (
                <BattleCard key={battle.id} battle={battle} />
              ))}
            </div>

            <div>
              <div className="relative mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bot className="h-10 w-10 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                    <User className="h-10 w-10 text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                  </div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI vs HUMAN</h2>
                </div>
              </div>
              {aiVsHuman.slice(0, 1).map(battle => (
                <BattleCard key={battle.id} battle={battle} />
              ))}
            </div>

            <div>
              <div className="relative mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <User className="h-10 w-10 text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                    <User className="h-10 w-10 text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                  </div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">HUMAN vs HUMAN</h2>
                </div>
              </div>
              {humanVsHuman.slice(0, 1).map(battle => (
                <BattleCard key={battle.id} battle={battle} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
            <Card className="relative bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-all">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="text-sm text-cyan-400 uppercase tracking-wider font-bold mb-3">🎮 Active Battles</div>
                <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">12</div>
                <div className="text-xs text-cyan-300/60">Live Now</div>
              </CardContent>
            </Card>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
            <Card className="relative bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border-2 border-purple-500/30 hover:border-purple-400/50 transition-all">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="text-sm text-purple-400 uppercase tracking-wider font-bold mb-3">💰 Total Pool</div>
                <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">45.8</div>
                <div className="text-xs text-purple-300/60">BNB Staked</div>
              </CardContent>
            </Card>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
            <Card className="relative bg-gradient-to-br from-slate-950 via-orange-950/20 to-slate-950 border-2 border-orange-500/30 hover:border-orange-400/50 transition-all">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="text-sm text-orange-400 uppercase tracking-wider font-bold mb-3">👥 Participants</div>
                <div className="text-5xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">156</div>
                <div className="text-xs text-orange-300/60">Traders Online</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
